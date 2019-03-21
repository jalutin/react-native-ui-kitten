/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  Dimensions,
  View,
  ViewProps,
  StyleSheet,
} from 'react-native';
import {
  StyledComponentProps,
  StyleType,
} from '@kitten/theme';
import {
  TabBarIndicator,
  Props as TabBarIndicatorProps,
} from '../tab/tabBarIndicator.component';
import { Props as TabProps } from './bottomNavigatorTab.component';

/**
 * The `BottomNavigatorTab` component is a part of the BottomTabNavigator component.
 *
 * @extends React.Component
 *
 * @property {number} selectedIndex - Determines index of the selected tab.
 *
 * @property {React.ReactElement<TabProps> | React.ReactElement<TabProps>[]} children -
 * Determines tabs of the navigator. Can be passed through JSX.
 *
 * @property {(index: number) => void} onSelect - Triggered on select value.
 *
 * ### Usage
 *
 * @example with React Navigation usage example
 *
 * ```tsx
 * import { Image } from 'react-native';
 * import {
 *   BottomNavigatorTab,
 *   BottomTabNavigator,
 * } from '@kitten/ui';
 * import {
 *   createBottomTabNavigator,
 *   NavigationContainer,
 *   NavigationContainerProps,
 *   NavigationScreenProp,
 *   NavigationState,
 *   NavigationRoute,
 * } from 'react-navigation';
 *
 * type CommonNavigationProps = NavigationProps & NavigationContainerProps;
 *
 * export const TabNavigatorScreen: NavigationContainer = createBottomTabNavigator({
 *   ...screens,
 * }, {
 *   initialRouteName: 'Screen1',
 *   tabBarComponent: (props: CommonNavigationProps) => renderBottomNavigation(props),
 * });
 *
 *function renderBottomNavigation(props: CommonNavigationProps): React.ReactElement<ViewProps> {
 *  const routes: NavigationRoute[] = props.navigation.state.routes;
 *  const index: number = props.navigation.state.index;
 *
 *  return (
 *   <BottomTabNavigatorComponent
 *     selectedIndex={index}
 *     onSelect={(selectedIndex: number) => navigateToTab(selectedIndex)}>
 *     <BottomNavigatorTab
 *       title='Screen 1'
 *       icon={(style: StyleType) => <Image source={getIconSource(style, index)}/>}/>
 *     <BottomNavigatorTab
 *       title='Screen 2'
 *       icon={(style: StyleType) => <Image source={getIconSource(style, index)}/>}/>
 *       <BottomNavigatorTab
 *       title='Screen 3'
 *       icon={(style: StyleType) => <Image source={getIconSource(style, index)}/>}/>
 *    </BottomTabNavigatorComponent>
 *  );
 * }
 * ```
 * */

type ChildElement = React.ReactElement<TabProps>;

interface TabNavigatorProps {
  children: ChildElement | ChildElement[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

export type Props = TabNavigatorProps & StyledComponentProps & ViewProps;

export class BottomTabNavigator extends React.Component<Props> {

  static defaultProps: Partial<Props> = {
    selectedIndex: 0,
  };

  private getComponentStyle = (style: StyleType): StyleType => {
    return {
      container: {
        backgroundColor: style.backgroundColor,
        paddingVertical: style.paddingVertical,
        borderTopColor: style.borderTopColor,
        borderTopWidth: style.borderTopWidth,
      },
      indicator: {
        height: style.indicatorHeight,
        backgroundColor: style.indicatorBackgroundColor,
      },
    };
  };

  private onChildPress = (index: number): void => {
    if (this.props.onSelect && this.props.selectedIndex !== index) {
      this.props.onSelect(index);
    }
  };

  private renderIndicatorElement = (positions: number, style: StyleType): React.ReactElement<TabBarIndicatorProps> => {
    return (
      <TabBarIndicator
        key={0}
        style={[style, styles.indicator]}
        selectedPosition={this.props.selectedIndex}
        positions={positions}
      />
    );
  };

  private renderTabElement = (element: ChildElement, index: number): React.ReactElement<TabProps> => {
    return React.cloneElement(element, {
      key: index,
      style: { flex: 1 },
      selected: index === this.props.selectedIndex,
      onSelect: () => this.onChildPress(index),
    });
  };

  private renderComponentChildren = (items: ChildElement | ChildElement[],
                                     style: StyleType): React.ReactElement<any>[] => {

    const { indicator } = style;

    const tabElements: React.ReactElement<TabProps>[] = React.Children.map(items, this.renderTabElement);

    // FIXME:
    const shouldShowIndicator: boolean = indicator.backgroundColor !== 'transparent';

    return [
      shouldShowIndicator ? this.renderIndicatorElement(tabElements.length, indicator) : undefined,
      ...tabElements,
    ];
  };

  public render(): React.ReactNode {
    const { style, themedStyle, children, ...derivedProps } = this.props;
    const { container, ...componentStyles } = this.getComponentStyle(themedStyle);

    const componentChildren: ChildElement[] = this.renderComponentChildren(children, componentStyles);

    return (
      <View
        {...derivedProps}
        style={[container, style, styles.container]}>
        {componentChildren}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
  },
  indicator: {
    position: 'absolute',
  },
});
