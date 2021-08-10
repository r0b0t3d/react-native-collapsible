# @r0b0t3d/react-native-collapsible

Fully customizable collapsible views

![alt text](pictures/collapsible-combination.gif "Intro")
## Installation

```sh
yarn add @r0b0t3d/react-native-collapsible
```

Currently, I am using `react-native-reanimated` for animation. So you should install it as well

`$ yarn add react-native-reanimated`

## Usage

```jsx
import {
    CollapsibleFlatList,
    CollapsibleScrollView,
} from '@r0b0t3d/react-native-collapsible';

// ...
const MyComponent = () => {
    const { 
        collapse,   // <-- Collapse header
        expand,     // <-- Expand header
        scrollY,    // <-- Animated scroll position. In case you need to do some animation in your header or somewhere else
    } = useCollapsibleContext();

    return (
        <View>
            <CollapsibleHeaderContainer>
                <!-- Your header view -->
            </CollapsibleHeaderContainer>
            <CollapsibleFlatList
                data={data}
                renderItem={renderItem}
            />
        </View>
    )
}

export default withCollapsibleContext(MyComponent); // <-- wrap your component with `withCollapsibleContext`
```

## Tips
#### 1. Trigger scroll when scroll inside `CollapsibleHeaderContainer` 
- If your header doesn't contains touchable component, try `pointerEvents="none"`
```jsx
<CollapsibleHeaderContainer>
    <View pointerEvents="none">
        <Text>Header</Text>
    </View>
</CollapsibleHeaderContainer>
```
- If your header contains touchable componet, try to set `pointerEvents="box-none"` for every nested views that contains touchable, otherwise use `pointerEvents="none"`
```jsx
<CollapsibleHeaderContainer>
    <View pointerEvents="box-none"> // <-- this is parent view
        <View pointerEvents="none"> // <-- this view doesn't contain touchable component
            <Text>Header</Text>
        </View>
        <View pointerEvents="box-none"> // <-- this view contain touchable component
            <View pointerEvents="none">
                <Text>Some text</Text>
            </View>
            <TouchableOpacity>
                <Text>Button</Text>
            </TouchableOpacity>
        </View>
    </View>
</CollapsibleHeaderContainer>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
