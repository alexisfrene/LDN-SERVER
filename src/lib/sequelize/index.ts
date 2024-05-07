import { Sequelize } from "sequelize";
import userModel from "./models/Users";
import sizeModel from "./models/Sizes";
import productModel from "./models/Products";
import categoryModel from "./models/Categories";
import detailModel from "./models/Details";
import { config as connectionPSQL } from "./config/config";

const env = "development";
const config = connectionPSQL[env];
if (
  !config.username ||
  !config.password ||
  !config.database ||
  !config.host ||
  !config.port
) {
  throw new Error("Missing required connection configuration properties.");
}
const db: Record<string, any> = {};

let sequelize: Sequelize;

sequelize = new Sequelize(
  config.database || "",
  config.username || "",
  config.password || "",
  { host: config.host, dialect: "postgres", logging: false }
);

const User = userModel(sequelize);
const Size = sizeModel(sequelize);
const Product = productModel(sequelize);
const Category = categoryModel(sequelize);
const Detail = detailModel(sequelize);

db[User.name] = User;
db[Size.name] = Size;
db[Product.name] = Product;
db[Category.name] = Category;
db[Detail.name] = Detail;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//sequelize.sync({ force: true });
//Product.sync({ force: true });
// Category.sync({ force: true });
//Size.sync({ force: true });
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
