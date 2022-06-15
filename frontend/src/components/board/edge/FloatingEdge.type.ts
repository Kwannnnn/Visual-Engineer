export interface FloatingEdgeProps {
    id: string;
    source: string;
    target: string;
    markerEnd?: string | undefined;
    markerStart?: string | undefined;
    style?: React.CSSProperties | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: { [key: string]: any };
}
