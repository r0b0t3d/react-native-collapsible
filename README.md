# @r0b0t3d/react-native-collapsible

Fully customizable collapsible views

![alt text](pictures/intro.gif 'Intro')

## Installation

```sh
yarn add @r0b0t3d/react-native-collapsible
```

I am using `reanimated 2` for animation. So you should install and follow instruction here to setup your project [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/installation)

## Key features
1️⃣ Support FlatList/ScrollView
2️⃣ Support sticky header
3️⃣ Can have multiple sticky headers
4️⃣ Easy to customize

## Usage
### 1. Basic
```jsx
import {
  CollapsibleContainer,
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
    <CollapsibleContainer>          // 1️⃣ (Required) Outermost container 
      <CollapsibleHeaderContainer>  // 2️⃣ (Required) Header view
        <!-- Your header view -->
        <StickyView>                // 3️⃣ Sticky view
          <!-- Your sticky view goes here -->
        </StickyView>
      </CollapsibleHeaderContainer>
      <CollapsibleFlatList          // 4️⃣ (Required) Your FlatList/ScrollView
        data={data}
        renderItem={renderItem}
        headerSnappable={false} // <-- should header auto snap when you release the finger
      />
    </CollapsibleContainer>
  )
}

export default withCollapsibleContext(MyComponent); // 5️⃣ (Required)wrap your component with `withCollapsibleContext`
```

### 2. Advance
We support multiple `CollapsibleHeaderContainer` and `StickyView`. It come useful in case you need to break your code into smaller component.

`Parent.tsx`
```jsx
const Parent = () => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <CollapsibleContainer>
      <CollapsibleHeaderContainer>
        <!-- Your header view -->
        <StickyView>
          <TabView currentTab={tabIndex} onTabChange={setTabIndex} />
        </StickyView>
      </CollapsibleHeaderContainer>

      {tabIndex === 0 && <FirstTab />}
      {tabIndex === 1 && <SecondTab />}
    </CollapsibleContainer>
  )
}
```

`FirstTab.tsx`
```jsx
const FirstTab = () => {
  return (
    <>
      <CollapsibleHeaderContainer>
        <!-- 😍 You can have another headerview in each tab where you can add another StickyView there -->
        <StickyView>
          <!-- Your sticky view goes here -->
        </StickyView>
        <View />
        <StickyView>
          <!-- 🚀 Bonus, multiple sticky view -->
        </StickyView>
      </CollapsibleHeaderContainer>
      <CollapsibleFlatList
        data={data}
        renderItem={renderItem}
      />
    </>
  )
}
```

## Show cases
```
Note: Feel free to add your show case here by a PR
```
| App         | Gif         |
| ----------- | ----------- |
| [ANU Global](https://apps.apple.com/us/app/anu-global/id1540735849) | <img src="/pictures/showcases/anu.gif" height="350"/> |

## Breaking changes

### 1.0.0

- Removed

  - `persistHeaderHeight`
  - `contentMinHeight`

- Added
  - `CollapsibleContainer`
  - `StickyView`

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
