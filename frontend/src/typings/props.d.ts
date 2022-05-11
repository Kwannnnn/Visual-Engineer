declare namespace Prop {
    type ButtonProp = {
        onClick?: () => void;
        className?: string;
        children?: any;
    }

    type ContainerProp = {
        className?: string;
        children?: any;
    }

    type DBItemProp = {
        className?: string;
        properties: { [key: string]: any }[];
    }
}

export = Prop;
