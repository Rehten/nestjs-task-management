import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async signUp({ username, password }: AuthCredentialsDto): Promise<void> {
        const user: User = new User();

        user.username = username;
        user.password = password;

        await user.save();
    }
}
