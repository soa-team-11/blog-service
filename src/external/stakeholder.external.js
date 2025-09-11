import axios from "axios";

export const doesUserExist = async (userId) => {
    try {
        const response = await axios.get(`${process.env.STAKEHOLDERS_SERVICE_URL}/profiles/getByUserId?user_id=${userId}`);
        return true;
    } catch (error) {
        return false;
    }
};

export const isUserFollowing = async (userId, blogUserId) => {
    try {
        const response = await axios.get(`${process.env.FOLLOWER_SERVICE_URL}/is-following?userId=${userId}&followeeId=${blogUserId}`);
        return response.data.isFollowing;
    } catch (error) {
        return error.message;
    }
}