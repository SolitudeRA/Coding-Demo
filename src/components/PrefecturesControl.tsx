/*#######################################################################################

    都道府県選択コンポーネント コントロール

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { memo, MouseEventHandler } from 'react';
import { Prefecture } from './Prefectures';

interface CheckboxProps {
  name: string;
  containerClassname?: string | undefined;
  defaultValue: string;
  onCheck: (prefecture: Prefecture) => void;
  checked: boolean;
}

export const Checkbox = memo(function Checkbox({
  name,
  containerClassname,
  defaultValue,
  onCheck,
  checked,
}: CheckboxProps) {
  const handleClick: MouseEventHandler = event => {
    event.preventDefault();
    event.stopPropagation();
    checked = !checked;
    onCheck({ prefCode: Number(defaultValue), prefName: name });
  };

  return (
    <div className={containerClassname} onClick={handleClick}>
      <input
        id={`checkbox-${name}`}
        type="checkbox"
        name={name}
        defaultValue={defaultValue}
        checked={checked}
        readOnly={true}
      />
      <label htmlFor={`checkbox-${name}`}>{name}</label>
    </div>
  );
});
