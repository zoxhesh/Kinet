#!/usr/bin/env python3
"""
WCAG Contrast Checker for Design Tokens
Usage: python3 contrast.py tokens.json
Exits with code 1 if any AA failure found.
"""

import json
import sys
import re

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple (0-255)."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_luminance(rgb):
    """Calculate relative luminance per WCAG 2.1."""
    def channel(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_ratio(fg_hex, bg_hex):
    """Calculate contrast ratio between two hex colors."""
    fg_lum = rgb_to_luminance(hex_to_rgb(fg_hex))
    bg_lum = rgb_to_luminance(hex_to_rgb(bg_hex))
    lighter = max(fg_lum, bg_lum)
    darker = min(fg_lum, bg_lum)
    return (lighter + 0.05) / (darker + 0.05)

def get_required_ratio(text_size_px, font_weight):
    """Determine required contrast ratio per WCAG AA."""
    # Large text: >= 18px or >= 14px bold
    is_large = text_size_px >= 18 or (text_size_px >= 14 and font_weight >= 600)
    return 3.0 if is_large else 4.5

def resolve_color(tokens, color_ref, mode='light'):
    """Resolve a color reference (role or palette) to hex."""
    # Check roles first
    if color_ref in tokens['color']['roles']:
        role = tokens['color']['roles'][color_ref]
        return role[mode] if isinstance(role, dict) and mode in role else role
    # Check palette
    if '.' in color_ref:
        palette_name, shade = color_ref.split('.')
        if palette_name in tokens['color']['palette']:
            return tokens['color']['palette'][palette_name].get(shade)
    return None

def check_pair(tokens, pair, mode='light'):
    """Check a single text/background pair."""
    fg_hex = resolve_color(tokens, pair['text'], mode)
    bg_hex = resolve_color(tokens, pair['background'], mode)

    if not fg_hex or not bg_hex:
        return {
            'pair': pair,
            'mode': mode,
            'status': 'ERROR',
            'message': f'Could not resolve colors: text={pair["text"]} ({fg_hex}), bg={pair["background"]} ({bg_hex})'
        }

    ratio = contrast_ratio(fg_hex, bg_hex)

    # Determine required ratio based on pair type
    pair_type = pair.get('type', 'text')
    if pair_type == 'non-text':
        # Non-text UI elements (borders, icons, focus rings) need 3:1 per WCAG 2.1
        required = 3.0
        text_size = None
        font_weight = None
    else:
        # Text elements
        text_size = 16
        font_weight = 400
        if 'badge' in pair.get('description', '').lower():
            text_size = 12
            font_weight = 600
        elif 'button' in pair.get('description', '').lower():
            text_size = 16
            font_weight = 600
        required = get_required_ratio(text_size, font_weight)

    passed = ratio >= required

    return {
        'pair': pair,
        'mode': mode,
        'fg': fg_hex,
        'bg': bg_hex,
        'ratio': round(ratio, 2),
        'required': required,
        'passed': passed,
        'status': 'PASS' if passed else 'FAIL',
        'text_size': text_size,
        'font_weight': font_weight,
        'pair_type': pair_type,
    }

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 contrast.py tokens.json")
        sys.exit(1)

    tokens_path = sys.argv[1]
    with open(tokens_path, 'r') as f:
        tokens = json.load(f)

    pairs = tokens.get('pairs', [])
    if not pairs:
        print("No pairs defined in tokens.json")
        sys.exit(0)

    print(f"Checking {len(pairs)} color pairs for WCAG AA compliance...\n")

    all_results = []
    failures = 0

    for mode in ['light', 'dark']:
        print(f"=== {mode.upper()} MODE ===")
        for pair in pairs:
            result = check_pair(tokens, pair, mode)
            all_results.append(result)

            status_icon = "✅" if result['status'] == 'PASS' else "❌"
            print(f"  {status_icon} {result['pair']['description']}")
            print(f"      Text: {result['fg']}  |  BG: {result['bg']}  |  Ratio: {result['ratio']}:1  |  Required: {result['required']}:1")

            if result['status'] == 'FAIL':
                failures += 1
        print()

    print(f"=== SUMMARY ===")
    print(f"Total checks: {len(all_results)}")
    print(f"Passed: {len(all_results) - failures}")
    print(f"Failed: {failures}")

    if failures > 0:
        print("\n❌ WCAG AA FAILURES DETECTED — Fix tokens.json and re-run")
        sys.exit(1)
    else:
        print("\n✅ All checks passed WCAG AA")
        sys.exit(0)

if __name__ == '__main__':
    main()