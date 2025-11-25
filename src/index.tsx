import { render } from 'preact';

import './style.css';
import { ThemeProvider } from '@material-tailwind/react/context/theme';
import { Button } from '@material-tailwind/react/components/Button';

export function App() {
  return (
    <div>
      <section>
        This is an example section
      </section>
      <Button>Button</Button>
    </div>
  );
}

render(<ThemeProvider><App /></ThemeProvider>, document.getElementById('app'));
