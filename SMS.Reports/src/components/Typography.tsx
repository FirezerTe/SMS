import { Text } from "@react-pdf/renderer";

type Props = React.ComponentProps<typeof Text> & { amharic?: boolean };
export const Typography = ({ amharic, ...others }: Props) => {
  return <Text {...others} />;
};
