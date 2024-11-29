
interface UserInfoProps {
    userName: string
    userEmail: string
}

const UserInfoDisplay: React.FC<UserInfoProps> = ({ userName, userEmail }) => (
    <div>
        <p><strong>User:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
    </div>
);


export default UserInfoDisplay