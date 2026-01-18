import { User } from "../types/auth";

class DBEntity {
     mobile: String = ""; 
     user?: User;

}
const DB = new DBEntity();
export default DB;