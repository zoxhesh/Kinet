/**
 * TabBar - Navigation primitive
 * 4-5 tabs, height 80px with safe area
 * States: active, inactive, badge
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { colors, radius, spacing, motion, typography, zIndex } from '@/design/tokens';

interface TabItem {
  name: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | string;
  href: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (name: string) => void;
  style?: ViewStyle;
}

const tabBarHeight = spacing.layout.tabBarHeight;

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
}) => {
  const tabCount = tabs.length;
  const tabWidth = `${100 / tabCount}%`;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { height: tabBarHeight + (Platform.OS === 'ios' ? 0 : 0) },
        style,
      ]}
      edges={['bottom']}
    >
      <Box
        row
        style={{
          height: tabBarHeight,
          backgroundColor: colors.light.surface,
          borderTopWidth: borders.width,
          borderTopColor: colors.light.border,
          position: 'relative',
        }}
      >
        {/* Active indicator */}
        <AnimatedTabIndicator
          activeTab={activeTab}
          tabs={tabs}
          tabWidth={tabWidth}
        />

        {tabs.map((tab, index) => (
          <TabButton
            key={tab.name}
            tab={tab}
            isActive={activeTab === tab.name}
            onPress={() => onTabPress(tab.name)}
            tabWidth={tabWidth}
            index={index}
          />
        ))}
      </Box>
    </SafeAreaView>
  );
};

import { Animated, Easing } from 'react-native';

const TabButton: React.FC<{
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
  tabWidth: string;
  index: number;
}> = ({ tab, isActive, onPress, tabWidth }) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Animated.View
      style={[
        styles.tab,
        { width: tabWidth },
        isActive && styles.tabActive,
      ]}
    >
      <Animated.TouchableOpacity
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilitySelected={isActive}
        accessibilityLabel={tab.label}
        style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={[
            { transform: [{ scale: pressed ? 0.9 : 1 }] },
            isActive && { transform: [{ scale: 1.05 }] },
          ]}
        >
          {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
          <Animated.Text
            style={[
              styles.tabLabel,
              {
                color: isActive ? colors.light.accent : colors.light.textMuted,
                fontWeight: isActive ? '600' : '400',
                fontSize: 11,
                marginTop: 4,
                opacity: isActive ? 1 : 0.8,
              },
            ]}
          >
            {tab.label}
          </Animated.Text>
        </Animated.View>
        {tab.badge && (
          <Animated.View
            style={[
              styles.badge,
              { opacity: isActive ? 1 : 0.7 },
            ]}
          >
            <Animated.Text style={styles.badgeText}>
              {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
            </Animated.Text>
          </Animated.View>
        )}
      </Animated.TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedTabIndicator: React.FC<{
  activeTab: string;
  tabs: TabItem[];
  tabWidth: string;
}> = ({ activeTab, tabs, tabWidth }) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const activeIndex = tabs.findIndex(t => t.name === activeTab);

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: activeIndex * (100 / tabs.length),
      duration: motion.semantic.tabSwitch.duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  return (
    <Animated.View
      style={[
        styles.indicator,
        {
          width: tabWidth,
          transform: [{ translateX: translateX.interpolate({
            inputRange: [0, tabs.length - 1],
            outputRange: [0, 100],
          }) + '%' }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: zIndex.sticky,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {},
  tabLabel: {
    fontFamily: typography.fontFamilies.sans,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.light.accent,
    borderTopLeftRadius: radius.semantic.button,
    borderTopRightRadius: radius.semantic.button,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: radius.semantic.badge,
    backgroundColor: colors.light.danger,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.light.onAccent,
    fontSize: 10,
    fontWeight: '600',
    fontFamily: typography.fontFamilies.sans,
  },
});

export default TabBar;