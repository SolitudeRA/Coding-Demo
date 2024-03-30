import type { FormEventHandler, MouseEventHandler } from 'react';

interface DefaultProps {
  name?: string | undefined;
  className?: string | undefined;
  containerClassname?: string | undefined;
  controlClassName?: string | undefined;
  labelClassName?: string | undefined;
  innerText?: string;
  defaultValue?: string | undefined;
  handleFunction?: FormEventHandler | undefined;
  handleLabelClick?: MouseEventHandler | undefined;
}

export function Button({ name, className, handleFunction, innerText }: DefaultProps) {
  return (
    <button className={className} name={name} onClick={handleFunction}>{innerText}</button>
  );
}

export function Checkbox({
                           name,
                           containerClassname,
                           controlClassName,
                           defaultValue,
                           handleFunction,
                           labelClassName,
                           innerText,
                           handleLabelClick
                         }: DefaultProps) {
  return (
    <div className={containerClassname}>
      <input type={'checkbox'}
             className={controlClassName}
             name={name}
             defaultValue={defaultValue}
             onInput={handleFunction}
      />
      <label
        className={labelClassName}
        form={name}
        onClick={handleLabelClick}
      >
        {innerText}
      </label>
    </div>
  );
}