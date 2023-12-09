import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import './style.css';

type ContextModel = {
  state: any;
  dispatch: Dispatch<any>;
};
const PlugContext = createContext(null as ContextModel);

const PlugProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    if (state[action.type] !== action.payload) {
      return {
        ...state,
        [action.type]: action.payload,
      };
    }
    return state;
  }, {});

  return (
    <PlugContext.Provider value={useMemo(() => ({ state, dispatch }), [state])}>
      {children}
    </PlugContext.Provider>
  );
};

type PluggedProps<T = {}> = {
  name?: string;
  value?: T | (() => T);
};

const PluggedProperty: FC<PluggedProps> = ({ name, value }) => {
  const context = useContext(PlugContext);
  if (!context) {
    return (
      <div
        style={{
          border: 'solid 1px #aaa',
          padding: '.2em',
          backgroundColor: 'lightyellow',
        }}
      >
        <span>PlugContext is missing</span>
        <dl>
          <dt>{name}</dt>
          <dd>
            <pre style={{ margin: '0' }}>
              <code>
                {JSON.stringify(
                  typeof value == 'function' ? value() : value,
                  null,
                  2
                )}
              </code>
            </pre>
          </dd>
        </dl>
      </div>
    );
  }

  useEffect(() => {
    context.dispatch({
      type: name,
      payload: value,
    });
  }, [name, value]);

  return null;
};

const JsonView = ({ name }: { name?: string }) => {
  const { state } = useContext(PlugContext);
  return (
    <pre>
      <code>{JSON.stringify(name ? state[name] : state, null, 2)}</code>
    </pre>
  );
};

export const App: FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      <PlugProvider>
        <PluggedProperty name={'test'} value={345} />
        <PluggedProperty name={'lemon'} value={'juice'} />

        {Array.from({ length: 5 }).map((x, i) => (
          <PluggedProperty name={`elm_${i}`} value={i * 3} />
        ))}

        <h1>Hello {name}!</h1>
        <p>Start editing to see some magic happen :)</p>
        <JsonView />
      </PlugProvider>

      <PluggedProperty name={'test'} value={() => ({ magic: 8 })} />
    </div>
  );
};
