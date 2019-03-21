/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageProps,
  TextProps,
  TouchableOpacityProps,
} from 'react-native';
import {
  StyledComponentProps,
  StyleType,
} from '@kitten/theme';

/**
 * The `BottomNavigatorTab` component is a part of the BottomTabNavigator component.
 *
 * @extends React.Component
 *
 * @property {boolean} selected - Determines whether component is selected.
 *
 * @property {string} title - Determines the title of the tab.
 *
 * @property {(style: StyleType) => React.ReactElement<ImageProps>} icon - Determines
 * the icon of the tab.
 *
 * @property {(selected: boolean) => void} onSelect - Triggered on select value.
 *
 * @example Simple usage example
 *
 * ```tsx
 * import { BottomNavigatorTab } from '@kitten/ui';
 * <BottomNavigatorTab selected={true}/>
 * ```
 *
 * ### Usage
 *
 * Bottom Navigator Tabs should be wrapped in BottomTabNavigator to provide usable component.
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

interface BottomNavigatorTabProps {
  title?: string;
  icon?: (style: StyleType) => React.ReactElement<ImageProps>;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export type Props = BottomNavigatorTabProps & StyledComponentProps & TouchableOpacityProps;

export class BottomNavigatorTab extends React.Component<Props> {

  private onPress = () => {
    if (this.props.onSelect) {
      this.props.onSelect(!this.props.selected);
    }
  };

  private getComponentStyle = (source: StyleType): StyleType => {
    return {
      icon: {
        width: source.iconWidth,
        height: source.iconHeight,
        marginBottom: source.iconMarginBottom,
        tintColor: source.iconTintColor,
      },
      title: {
        color: source.textColor,
        fontWeight: source.textFontWeight,
      },
    };
  };

  private renderImageElement(style: StyleType): React.ReactElement<ImageProps> | null {
    const icon: React.ReactElement<ImageProps> = this.props.icon ?
      this.props.icon(style) : null;
    return icon ? React.cloneElement(icon, {
      style: {
        ...(icon.props.style as object),
        marginBottom: style.source,
      },
      key: 1,
    }) : null;
  }

  private renderTextElement(style: StyleType): React.ReactElement<TextProps> | null {
    const { title } = this.props;
    return title && title.length !== 0 ? (
      <Text
        key={2}
        style={style}>
        {this.props.title}
      </Text>
    ) : null;
  }

  private renderComponentChildren = (style: StyleType): React.ReactNode => ([
    this.renderImageElement(style.icon),
    this.renderTextElement(style.title),
  ]);

  public render(): React.ReactNode {
    const { style, themedStyle, ...derivedProps } = this.props;
    const componentStyles: StyleType = this.getComponentStyle(themedStyle);
    const componentChildren: React.ReactNode = this.renderComponentChildren(componentStyles);

    return (
      <TouchableOpacity
        {...derivedProps}
        style={[style, styles.container]}
        activeOpacity={1.0}
        onPress={this.onPress}>
        {componentChildren}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
