import type { Preview } from '@storybook/react-vite';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'ordem-dark',
      values: [
        { name: 'ordem-dark', value: '#09090b' },
        { name: 'zinc-900', value: '#18181b' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-zinc-950 text-zinc-100 min-h-[160px] p-6 antialiased font-sans flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;