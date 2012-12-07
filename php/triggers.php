<?php

include "DB.php";

$db = DB::getInstance();
/*  UPDATE trigger
$query = "DELIMITER |

CREATE TRIGGER cont_full AFTER UPDATE ON containers
  FOR EACH ROW BEGIN
    IF OLD.State = 0 AND NEW.State = 1 THEN
        INSERT INTO history SET Operation = 1, ID = NEW.ID, history.Date = DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i');
    ELSEIF OLD.State = 1 AND NEW.State = 0 THEN
    	INSERT INTO history SET Operation = 2, ID = NEW.ID, history.Date = DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i');
    ELSEIF NEW.Longitude <> OLD.Longitude OR NEW.Latitude <> OLD.Latitude THEN
    	INSERT INTO history SET Operation = 5, ID = NEW.ID, history.Date = DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i'), Origin = CONCAT(OLD.Longitude, '-', OLD.Latitude), Destination = CONCAT(NEW.Longitude, '-', NEW.Latitude);
    END IF;
  END
|

DELIMITER ;";
*/

/*  INSERT trigger
$query = "DELIMITER |

CREATE TRIGGER cont_add AFTER INSERT ON containers
  FOR EACH ROW BEGIN
    INSERT INTO history SET Operation = 4, ID = NEW.ID, history.Date = DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i'), Destination = CONCAT(NEW.Longitude, '-', NEW.Latitude);
  END
|

DELIMITER ;";
*/

/*  DELETE trigger

$query = "DELIMITER |

CREATE TRIGGER cont_rmv AFTER DELETE ON containers
  FOR EACH ROW BEGIN
    INSERT INTO history SET Operation = 3, ID = OLD.ID, history.Date = DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i'), Origin = CONCAT(OLD.Longitude, '-', OLD.Latitude);
  END
|

DELIMITER ;";

//*/
$result = $db->request($query);

?>