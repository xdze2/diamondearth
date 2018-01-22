j'ai un autre projet de cartographie.

L'idée part de l'appli What3words. Leur idée est de proposer un système d'adressage physique universel. Comme les coordonnées GPS (latitude, longitude) mais lisible et mémorisable par un humain et qui pourrait remplacer éventuellement l'adressage postale (pays, ville, rue, numéro).

Ils ont découpés la surface du globe en carrés de 3 par 3 mètres de coté, et assigné arbitrairement un triplet de mot à chacun.

J'aime bien l'idée, mais je trouve dommage de perdre le coté hiérarchique de l'adresse postale. Avec une adresse postale il est possible de se repérer, même sans carte. On peut savoir, en comparant les adresses, si deux lieux sont loin ou proche loin de l'autre (c.a.d. dans la même rue, dans la même ville). Ce n'est pas possible avec what3words. Le triplet de mots ne donne, en lui même, aucune information sur la position du point. L'utilisation d'une application web est forcement nécessaire.

Du coup, je me suis pris la tête avec ça. Je suis arrivé à l'idée qu'il doit être possible de découper le globe en losanges inclues les un dans les autres. Cela respecte la géométrique sphérique et il n'y a donc pas besoin de système de projection de coordonnées complexe. Il faut à priori une vingtaine de niveaux pour arriver à un losange de quelques mètres de coté. Un losange est découpé en quatre sous-losanges.

Pour que l'adresse soit prononçable, je pensais à un système de composition de syllabes. Un peu comme l'alphabet Shadock de 4 syllabes (Ga, Bu, Zo, Meu). Chacune de ces syllabes représentant un des sous-losanges possibles (nord, est, sud, ouest). Une adresse serait alors une suite de 20 syllabes, par exemple BuZoMeuGaGa ZoMeuZoGaGa GaMeuZoMeuZo GaBuMeuZoZo. C'est pas forcement le mieux.

Il est aussi possible de changer les syllabes en fonction du niveau. Cela peut être utile si une partie seulement de l'adresse est donnée. On peut alors reconnaître si le code correspond à un pays, un département ou un quartier. Les syllabes pourrait même changer en fonction du lieu et de l'usage, pour s'adapter par exemple à la prononciation locale.

Le système de découpage en losange respecte aussi les points cardinaux. Sans ordinateur, il est dois donc être possible de naviguer d'une adresse à une autre.

Enfin, la transposition de l'adresse à partir des coordonnées GPS est réalisable par un algorithme, à priori, relativement simple. Il ne doit donc pas avoir besoin de serveur, base de donnée et donc pas besoin de connexion internet.
