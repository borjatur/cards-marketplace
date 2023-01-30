import { UserType } from '../models/user.model.js';

class UserService {
  dal: any

  constructor(dal: any) {
    this.dal = dal;
  }

  async insertUser(user: UserType): Promise<any> {
    return this.dal.users.storeOne(user);
  }

  async getUserById(id: string): Promise<any> {
    return this.dal.users.get(id);
  }

  async getAllUsers(): Promise<any> {
    return this.dal.users.get();
  }

  async getUserByName(name: string): Promise<any> {
    return this.dal.users.getByName(name);
  }
}

export default UserService;