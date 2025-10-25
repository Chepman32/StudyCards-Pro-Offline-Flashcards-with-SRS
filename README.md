# StudyCards Pro — Offline Flashcards with SRS

A production-ready, fully offline iOS-first flashcard application built with React Native, featuring advanced spaced repetition, gesture-based interactions, and beautiful animations.

## Features

### Core Features
- ✅ **Fully Offline**: All data stored locally with SQLite
- ✅ **Spaced Repetition System (SRS)**: SM-2 algorithm with custom modifications
- ✅ **Gesture-First UI**: Intuitive swipe and tap interactions
- ✅ **Beautiful Animations**: Physics-based animations with Reanimated 3
- ✅ **Custom Skia Graphics**: High-performance rendering for splash and effects
- ✅ **Dark Mode**: Automatic theme switching with system preferences
- ✅ **Accessible**: VoiceOver support and Dynamic Type

### Study Features
- Create unlimited decks and cards
- Customizable study settings per deck
- Progress tracking and statistics
- Daily streak counter
- Review history and analytics
- Card state management (new, learning, review, relearning)

### Technical Highlights
- **React Native 0.75+** with New Architecture
- **TypeScript** for type safety
- **Zustand** for state management
- **Drizzle ORM** with SQLite
- **React Native Reanimated 3** for smooth animations
- **React Native Gesture Handler** for advanced gestures
- **React Native Skia** for custom graphics

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── TextInput.tsx
│   ├── DeckCard.tsx
│   ├── ReviewButton.tsx
│   └── EmptyState.tsx
├── screens/            # Main app screens
│   ├── DecksScreen.tsx
│   ├── DeckDetailScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── CardEditorScreen.tsx
│   ├── DeckEditorScreen.tsx
│   ├── SettingsScreen.tsx
│   └── SplashScreen.tsx
├── stores/             # Zustand state stores
│   ├── settingsStore.ts
│   ├── deckStore.ts
│   ├── cardStore.ts
│   └── statsStore.ts
├── database/           # SQLite configuration
│   ├── client.ts
│   ├── schema.ts
│   └── init.ts
├── hooks/              # Custom React hooks
│   ├── useTheme.ts
│   └── useAnimatedPress.ts
├── utils/              # Utility functions
│   ├── srs.ts         # Spaced repetition algorithm
│   └── animations.ts   # Animation configs
├── theme/              # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── index.ts
├── types/              # TypeScript types
│   └── index.ts
└── App.tsx             # Main app component
```

## Installation

```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Design System

### Colors
- Comprehensive light and dark theme support
- Semantic color tokens for consistency
- Accessible contrast ratios

### Typography
- SF Pro Text/Display for iOS
- Dynamic Type support
- Consistent type scale

### Spacing
- 8pt grid system
- Consistent padding and margins
- Large hit targets for accessibility

## SRS Algorithm

The app uses a modified SM-2 (SuperMemo 2) algorithm:

- **Again**: Resets interval to 1 day, decreases ease factor
- **Hard**: Gradual interval increase, slight ease decrease
- **Good**: Standard interval multiplication by ease factor
- **Easy**: Accelerated interval with bonus multiplier

Cards progress through states:
1. **New**: Never seen before
2. **Learning**: First review
3. **Review**: In active rotation
4. **Relearning**: After a lapse

## Performance

- Lazy loading for large datasets
- Optimized SQLite queries with indices
- Memoized components
- Efficient re-rendering with Zustand
- Smooth 60fps animations

## Privacy

- 100% offline operation
- No data collection
- No external API calls
- Optional export for backup

## Future Enhancements

- [ ] Media support (images, audio) - Pro feature
- [ ] Custom themes - Pro feature
- [ ] CSV import/export
- [ ] Local notifications for daily reminders
- [ ] Advanced statistics and charts
- [ ] iCloud sync (optional)

## License

Proprietary - All rights reserved

## Contributing

This is a production application. Please contact the maintainers before contributing.

---

**Built with ❤️ for learners**
