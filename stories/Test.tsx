import React, {ReactElement, useState} from 'react';

export type TestProps = { prefix: string; };
const Test = ({prefix}: TestProps): ReactElement => {
  const [state, setState] = useState(1);
  return (
    <div style={{padding: '1rem'}}>
      <button type="button" onClick={() => setState((p) => p + 1)}>
        <span>{prefix} {state}</span>
      </button>
    </div>
  );
};

export default Test;
