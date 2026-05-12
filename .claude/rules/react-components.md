---
description: Quy ước viết React component trong project
globs: "src/components/**/*.tsx"
alwaysApply: false
---

## React Component Rules

## 1. Luôn dùng function component với arrow syntax

```tsx
// Đúng
const MyButton = () => {
  return <button>Click me</button>;
};

// Sai
class MyButton extends React.Component {
  render() {
    return <button>Click me</button>;
  }
}
```

## 2. Dùng named export, không dùng default export

```tsx
// Đúng
export const MyButton = () => { ... }

// Sai
export default function MyButton() { ... }
```

## 3. Props interface đặt tên theo format: `{ComponentName}Props`

```tsx
// Đúng
interface MyButtonProps {
  label: string
  onClick: () => void
}

const MyButton = ({ label, onClick }: MyButtonProps) => { ... }

// Sai
interface Props {
  label: string
}
```

## 4. Co-locate styles dùng Tailwind — không tạo file CSS riêng

```tsx
// Đúng — style nằm thẳng trong component
const MyButton = () => (
  <button className="rounded-lg bg-primary px-4 py-2 text-white">
    Click me
  </button>
);

// Sai — tạo file CSS riêng
// MyButton.css → import './MyButton.css'
```
