import { Card, CardBody } from "reactstrap";
import styles from "./TopCards.module.css";
function TopCards({ bg, icon, value, title }) {
  return (
    <Card>
      <CardBody>
        <div className={styles.wholeCard}>
          <div style={{ backgroundColor: bg }} className={`${styles.icon}`}>
            {icon}
          </div>
          <div className={styles.content}>
            <h3 className={styles.value}>{value}</h3>
            <small className={styles.title}>{title}</small>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default TopCards;
