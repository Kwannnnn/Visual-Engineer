declare namespace Prop {
    type ButtonProp = {
        onClick?: () => void;
        className?: string;
        id: string;
        children?: any;
    }

    type ContainerProp = {
        id: string;
        className?: string;
        children?: any;
    }

    type DBItemProp = {
        className?: string;
        properties: { [key: string]: any }[];
    }
}

export = Prop;
