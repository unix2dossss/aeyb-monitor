import React, { FC, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import tinycolor from 'tinycolor2';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	size?: 'small' | 'medium' | 'large';
	color?: string | undefined;
}

const Button: FC<ButtonProps> = ({ size = 'medium', color = 'blue', ...rest }) => {
	const isNamedColor = ['blue', 'green', 'red'].includes(color || '');

	const buttonClasses = classNames(
		'rounded-md font-medium filter brightness-100 hover:brightness-110 focus:outline-none transition duration-100 transform focus:translate-x-0.5 focus:translate-y-0.5',
		{
			'text-sm px-3 h-9': size === 'small',
			'text-base px-3 h-10': size === 'medium',
			'text-lg px-3.5 h-12': size === 'large',
			'bg-blue-500': isNamedColor && color === 'blue',
			'bg-green-500': isNamedColor && color === 'green',
			'bg-red-500': isNamedColor && color === 'red',
		}
	);

	const buttonStyle: React.CSSProperties = {
		backgroundColor: isNamedColor ? undefined : color,
		color: isNamedColor
			? tinycolor(`bg-${color}-500`).isDark()
				? 'white'
				: 'black'
			: tinycolor(color).isDark()
				? 'white'
				: 'black',
	};

	return <button className={buttonClasses} style={buttonStyle} {...rest} />;
};

export default Button;
