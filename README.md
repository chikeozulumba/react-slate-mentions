# React Slate Mentions

React component for enabling hashtags and mentions while editing. This is enabled while using either ``# or `@` preceeding the text to be inserted.

## Getting started

Install the  `react-slate-mentions` using the command below:

```shell
npm install react-slate-mentions
```

## Usage

Import the component to be used using the following:

```tsx
import { MentionEditor } from 'react-slate-mentions'
```

Optionally, you can also import the base css styles.

```tsx
import 'react-slate-mentions/dis/style.css'
```

Integrate the component into your project using the example below

```jsx
<MentionEditor
  editorClassname={...}
  editorId={...}
  placeholder={...}
  hashTagEnabled
  menuItems={...}
  collectedItems={...}
  isProcessing={...}
  handleSearch={...}
  searchContainerClassName={...}
  searchMenuItemClassName={...}
  elementClassName={...}
  handleItemsCollected={...}
  handleOnChange={...}
  initialValue={...}
  allowUniqueHashTags={...}
  allowUniqueMentions={...}
  loadingComponent={...}
  isReadOnly={...}
/>
```

## Component Props

The following are the available props for the component and their defaults

|           Name           |                           Type                           | Required |                      Description                      |   Default   |
| :----------------------: | :------------------------------------------------------: | :------: | :---------------------------------------------------: | :---------: |
|         editorId         |                         `string`                         |  false   |                       Editor ID                       | `undefined` |
|       placeholder        |                         `string`                         |  false   |                Editor placeholder text                | `undefined` |
|     editorClassname      |                         `string`                         |  false   |                   Editor classname                    | `undefined` |
|        menuItems         |          `Array<{ key: string; value: string}>`          |  false   |          List of dropdown items per trigger           | `undefined` |
|      collectedItems      | `Array<{ key: string; value: string; prefix?: string }>` |  false   |       List of dropdown items for unique sorting       | `undefined` |
|       isProcessing       |                        `boolean`                         |  false   |             State for pensing operations              | `undefined` |
|       handleSearch       |                        `Function`                        |  false   | Handle preparation of dropdown items in this function | `undefined` |
| searchContainerClassName |                         `string`                         |  false   |          Classname for editor menu container          | `undefined` |
| searchMenuItemClassName  |                         `string`                         |  false   |       Classname for editor dropdown menu items        | `undefined` |
|     elementClassName     |                         `string`                         |  false   |      Classname for editor elements during render      | `undefined` |
|   handleItemsCollected   |                        `Function`                        |  false   |       Function for returning newly added items        | `undefined` |
|      handleOnChange      |                        `Function`                        |  false   |         Function for getting editor contents          | `undefined` |
|   allowUniqueHashTags    |                        `boolean`                         |  false   |      Boolean for allowing/denying unique entries      | `undefined` |
|   allowUniqueMentions    |                        `boolean`                         |  false   |      Boolean for allowing/denying unique entries      | `undefined` |
|     loadingComponent     |                    `React.ReactNode`                     |  false   |  Component for displaying no result in the dropdown   | `undefined` |
|        isReadOnly        |                        `boolean`                         |  false   |       Boolean for triggering edit/no-edit mode        | `undefined` |
