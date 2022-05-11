declare namespace Prop {
    type ButtonProp = {
        onClick?: () => void;
        className?: string;
        children?: JSX;
    }

    type ContainerProp = {
        className?: string;
        children?: JSX;
    }
}

export = Prop;
