import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";

type Props = {
    address: string
}

const Profile = ({address}: Props) => {
    return (
        <Flex flexDirection="row" alignItems="center">
            <Avatar size="sm" marginX={3} />
            <Text>{address.slice(0, 5)}...{address.slice(address.length - 4)}</Text>
        </Flex>
    )
};

export default Profile;