# Руководство по работе с иконками

## Обзор изменений

Мы полностью переработали систему иконок в приложении, убрав статичный `iconMap` и сделав иконки динамическими.

## Как это работает

### CategoryCard.vue
```typescript
const iconName = computed(() => {
  const icon = props.category.icon
  
  // Если иконка уже содержит префикс i-lucide-, используем как есть
  if (icon?.startsWith('i-lucide-')) {
    return icon
  }
  
  // Если иконка без префикса, добавляем i-lucide-
  if (icon) {
    return `i-lucide-${icon}`
  }
  
  // Fallback иконка
  return 'i-lucide-package'
})
```

### Утилиты для иконок (`app/utils/icons.ts`)

- **popularCategoryIcons** - список популярных иконок с категориями
- **getIconName()** - получить полное имя иконки с префиксом
- **getIconsByCategory()** - получить иконки по категории
- **findIcon()** - поиск иконок по названию
- **isValidIcon()** - проверка существования иконки

### IconPicker компонент (`app/components/admin/IconPicker.vue`)

Компонент для выбора иконок в админке:
- Поиск по названию
- Фильтрация по категориям
- Предварительный просмотр
- Простое использование: `<IconPicker v-model="categoryIcon" />`

## Использование в админке

```vue
<template>
  <UFormGroup label="Иконка категории">
    <IconPicker v-model="form.icon" placeholder="Выберите иконку" />
  </UFormGroup>
</template>
```

## Добавление новых иконок

1. Найдите нужную иконку на [Lucide Icons](https://lucide.dev/icons/)
2. Добавьте её в `popularCategoryIcons` в `app/utils/icons.ts`
3. Укажите категорию и описание

```typescript
{ name: 'new-icon', label: 'Новая иконка', category: 'general' }
```

## Текущие категории в базе данных

- **houses-rental**: `home` → `i-lucide-home`
- **motorcycles-rental**: `bike` → `i-lucide-bike`  
- **cars-rental**: `car` → `i-lucide-car`

## Преимущества новой системы

1. **Динамичность** - не нужно обновлять код для новых иконок
2. **Простота** - админы могут выбирать иконки из интерфейса
3. **Расширяемость** - легко добавлять новые иконки
4. **Консистентность** - все иконки из одной библиотеки (Lucide)
5. **Fallback** - если иконка не найдена, показывается стандартная

## Локализация

Создали утилиты в `app/utils/localization.ts`:
- `getLocalizedString()` - универсальная функция для локализации
- `getCategoryName()` - получить название категории
- `getProductName()` - получить название продукта
- `getLocalizedDescription()` - получить описание

Это убирает дублирование кода и делает работу с локализацией единообразной.