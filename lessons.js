// Každá lekce je samostatný objekt. Nové lekce lze přidávat do tohoto pole.
const LESSONS = [
{id:'klasicka-hudba',category:'Hudba',emoji:'🎼',title:'Klasická hudba',intro:'Šest skladatelů, jejichž díla formovala evropskou hudbu.',sections:[
{title:'Johann Sebastian Bach (1685–1750)',text:'Německý barokní skladatel a mistr kontrapunktu. Jeho tvorba zahrnuje Braniborské koncerty, Matoušovy pašije a Dobře temperovaný klavír.',image:'Johann Sebastian Bach portrait Haussmann',extra:'Baroko – důraz na polyfonii a složitou stavbu skladeb.'},
{title:'Antonio Vivaldi (1678–1741)',text:'Italský barokní skladatel a houslista, autor cyklu Čtvero ročních dob. Působil také jako pedagog v benátském sirotčinci Ospedale della Pietà.',image:'Antonio Vivaldi portrait'},
{title:'Wolfgang Amadeus Mozart (1756–1791)',text:'Rakouský skladatel období klasicismu. Mezi jeho nejznámější díla patří Kouzelná flétna, Figarova svatba, Don Giovanni a nedokončené Rekviem.',image:'Wolfgang Amadeus Mozart portrait Barbara Krafft'},
{title:'Ludwig van Beethoven (1770–1827)',text:'Skladatel stojící na pomezí klasicismu a romantismu. Proslavil se mimo jiné Devátou symfonií, Měsíční sonátou a symfonií Osudovou. Komponoval i přes postupující ztrátu sluchu.',image:'Ludwig van Beethoven portrait Joseph Karl Stieler'},
{title:'Bedřich Smetana (1824–1884)',text:'Český skladatel, autor cyklu šesti symfonických básní Má vlast: Vyšehrad, Vltava, Šárka, Z českých luhů a hájů, Tábor a Blaník. Napsal opery Prodaná nevěsta, Libuše, Dalibor a Hubička.',image:'Bedrich Smetana portrait'},
{title:'Antonín Dvořák (1841–1904)',text:'Český skladatel světového významu. Proslavil se Symfonií č. 9 Z Nového světa, Slovanskými tanci a operou Rusalka. Působil také ve Spojených státech.',image:'Antonin Dvorak portrait'}],quiz:{q:'Kdo složil symfonický cyklus Má vlast?',a:'Bedřich Smetana.'}},
{id:'diktatori',category:'Moderní dějiny',emoji:'🏛️',title:'Diktátoři 20. století',intro:'Šest autoritářských vládců a jejich historický kontext.',sections:[
{title:'Adolf Hitler (1889–1945)',text:'Vůdce nacistického Německa od roku 1933. Jeho režim rozpoutal druhou světovou válku v Evropě a organizoval holokaust.',image:'Adolf Hitler historical photograph'},
{title:'Josif Stalin (1878–1953)',text:'Sovětský vůdce spojený s nucenou kolektivizací, politickými čistkami, gulagy a masovými represemi.',image:'Joseph Stalin portrait photograph'},
{title:'Benito Mussolini (1883–1945)',text:'Zakladatel italského fašismu. V Itálii vládl od roku 1922 a později se spojil s nacistickým Německem.',image:'Benito Mussolini historical portrait'},
{title:'Mao Ce-tung (1893–1976)',text:'Vůdce čínské komunistické revoluce a Čínské lidové republiky. Velký skok vpřed a kulturní revoluce měly rozsáhlé lidské a společenské důsledky.',image:'Mao Zedong portrait photograph'},
{title:'Francisco Franco (1892–1975)',text:'Španělský diktátor, který se dostal k moci po občanské válce a vládl do roku 1975.',image:'Francisco Franco historical portrait'},
{title:'Pol Pot (1925–1998)',text:'Vůdce Rudých Khmerů v Kambodži. Jeho režim v letech 1975–1979 způsobil smrt velké části obyvatelstva.',image:'Pol Pot photograph'}],quiz:{q:'Ve které zemi vládl Francisco Franco?',a:'Ve Španělsku.'}},
{id:'filmova-hudba',category:'Kultura',emoji:'🎬',title:'Filmová hudba',intro:'Hudební skladatelé, kteří dali filmům nezapomenutelný zvuk.',sections:[
{title:'John Williams (1932–)',text:'Americký skladatel známý hudbou k filmům Star Wars, Indiana Jones, Jurský park či Harry Potter.',image:'John Williams composer portrait'},
{title:'Hans Zimmer (1957–)',text:'Německý skladatel známý kombinováním orchestru a elektronických zvuků. Složil hudbu například k filmům Gladiátor, Počátek, Interstellar a Duna.',image:'Hans Zimmer composer photograph'},
{title:'Ennio Morricone (1928–2020)',text:'Italský skladatel proslulý hudbou k westernům Sergia Leoneho, filmu Mise a snímku Osm hrozných.',image:'Ennio Morricone portrait'},
{title:'Howard Shore (1946–)',text:'Kanadský skladatel, jehož rozsáhlá hudba k trilogii Pán prstenů využívá charakteristické motivy postav a míst.',image:'Howard Shore composer photograph'},
{title:'James Horner (1953–2015)',text:'Americký skladatel známý hudbou k filmům Titanic, Avatar a Statečné srdce.',image:'James Horner composer photograph'}],quiz:{q:'Kdo složil hudbu k trilogii Pán prstenů?',a:'Howard Shore.'}},
{id:'spisovatele',category:'Literatura',emoji:'📚',title:'Světoví spisovatelé',intro:'Dvanáct autorů, kteří zásadně ovlivnili světovou literaturu.',sections:[
{title:'William Shakespeare (1564–1616)',text:'Anglický dramatik, autor tragédií Hamlet, Macbeth, Othello a Romeo a Julie.',image:'William Shakespeare Chandos portrait'},
{title:'Lev Tolstoj (1828–1910)',text:'Ruský romanopisec, autor Vojny a míru a Anny Kareniny.',image:'Leo Tolstoy portrait photograph'},
{title:'Fjodor Dostojevskij (1821–1881)',text:'Ruský spisovatel zkoumající vinu, svědomí a víru v románech Zločin a trest a Bratři Karamazovi.',image:'Fyodor Dostoevsky portrait'},
{title:'George Orwell (1903–1950)',text:'Britský autor románů 1984 a Farma zvířat, které kriticky zobrazují totalitní moc.',image:'George Orwell portrait photograph'},
{title:'Ernest Hemingway (1899–1961)',text:'Americký spisovatel, autor knih Stařec a moře a Komu zvoní hrana.',image:'Ernest Hemingway portrait photograph'},
{title:'Franz Kafka (1883–1924)',text:'Pražský německy píšící spisovatel, autor Proměny a Procesu.',image:'Franz Kafka portrait photograph'},
{title:'Victor Hugo (1802–1885)',text:'Francouzský romantik, autor Bídníků a Chrámu Matky Boží v Paříži.',image:'Victor Hugo portrait photograph'},
{title:'Miguel de Cervantes (1547–1616)',text:'Španělský spisovatel, autor románu Důmyslný rytíř Don Quijote de la Mancha.',image:'Miguel de Cervantes portrait painting'},
{title:'Gabriel García Márquez (1927–2014)',text:'Kolumbijský nositel Nobelovy ceny, autor Sto roků samoty, spojený s magickým realismem.',image:'Gabriel Garcia Marquez portrait'},
{title:'J. R. R. Tolkien (1892–1973)',text:'Britský filolog a autor Hobita a Pána prstenů.',image:'J R R Tolkien photograph'},
{title:'Agatha Christie (1890–1976)',text:'Britská autorka detektivek, která vytvořila Hercula Poirota a slečnu Marplovou.',image:'Agatha Christie portrait'},
{title:'Johann Wolfgang Goethe (1749–1832)',text:'Německý básník a myslitel, autor Fausta a Utrpení mladého Werthera.',image:'Johann Wolfgang von Goethe portrait'}],quiz:{q:'Který autor napsal román 1984?',a:'George Orwell.'}},
{id:'starovek',category:'Historie',emoji:'🏺',title:'Starověké civilizace',intro:'Čtyři civilizace, jejichž dědictví ovlivňuje svět dodnes.',sections:[
{title:'Mezopotámie',text:'Oblast mezi řekami Eufrat a Tigris. Vznikala zde první města a klínové písmo; významnou památkou je Chammurapiho zákoník.',image:'Mesopotamia ziggurat Ur archaeology'},
{title:'Starověký Egypt',text:'Civilizace kolem Nilu známá pyramidami, hieroglyfy a vládou faraonů. Velká pyramida v Gíze vznikla přibližně ve 26. století př. n. l.',image:'Great Pyramid of Giza photograph'},
{title:'Starověké Řecko',text:'Řecké městské státy rozvíjely filozofii, divadlo a formy občanské správy. Athény jsou spojovány s ranou demokracií.',image:'Parthenon Athens photograph'},
{title:'Starověký Řím',text:'Z městského státu vznikla republika a později rozsáhlé císařství. Římské právo, silnice a architektura výrazně ovlivnily Evropu.',image:'Roman Colosseum photograph'}],quiz:{q:'Mezi kterými řekami ležela Mezopotámie?',a:'Mezi Eufratem a Tigridem.'}},
{id:'jizni-amerika',category:'Geografie',emoji:'🌎',title:'Jižní Amerika',intro:'Sedm zemí, jejich krajina, kultura a dějiny.',sections:[
{title:'Brazílie',text:'Největší stát Jižní Ameriky, jehož úředním jazykem je portugalština. Proslul Amazonkou, karnevalem a městem Rio de Janeiro.',image:'Rio de Janeiro Christ Redeemer photograph'},
{title:'Argentina',text:'Země pamp, tanga a Patagonie. Hlavním městem je Buenos Aires.',image:'Buenos Aires Obelisk photograph'},
{title:'Chile',text:'Velmi dlouhá země podél Tichého oceánu, s pouští Atacama na severu a Patagonií na jihu.',image:'Atacama Desert Chile photograph'},
{title:'Peru',text:'Země s významným dědictvím Incké říše. Nejznámější památkou je Machu Picchu v Andách.',image:'Machu Picchu Peru photograph'},
{title:'Kolumbie',text:'Země na severozápadě kontinentu, známá kávou, karibským pobřežím a rozmanitou přírodou.',image:'Cartagena Colombia old town photograph'},
{title:'Venezuela',text:'Země s rozsáhlými zásobami ropy. Nachází se zde Salto Ángel, jeden z nejvyšších vodopádů světa.',image:'Angel Falls Venezuela photograph'},
{title:'Uruguay',text:'Menší stát mezi Brazílií a Argentinou s hlavním městem Montevideo.',image:'Montevideo Uruguay waterfront photograph'}],quiz:{q:'Ve které zemi leží Machu Picchu?',a:'V Peru.'}},
{id:'cesky-stredovek',category:'České dějiny',emoji:'🇨🇿',title:'Český středověk',intro:'Od Velké Moravy přes Přemyslovce až po Karla IV.',sections:[
{title:'Velká Morava a rok 863',text:'Velká Morava patřila k prvním významným slovanským státním útvarům ve střední Evropě. Roku 863 přišli Konstantin (Cyril) a Metoděj s misí, která podpořila slovanskou liturgii a písemnictví.',image:'Great Moravia Mikulcice archaeological site'},
{title:'Svatý Václav († 935)',text:'Český kníže z rodu Přemyslovců, později uctívaný jako zemský patron. Podle tradičního datování byl zavražděn roku 935 ve Staré Boleslavi.',image:'Saint Wenceslaus medieval painting'},
{title:'Zlatá bula sicilská (1212)',text:'Listina vydaná Fridrichem II., která významně potvrdila dědičný královský titul českých panovníků.',image:'Golden Bull of Sicily 1212 manuscript'},
{title:'Konec Přemyslovců (1306)',text:'Zavražděním Václava III. v Olomouci roku 1306 vymřeli Přemyslovci po meči.',image:'Wenceslaus III of Bohemia medieval portrait'},
{title:'Karel IV. (1316–1378)',text:'Český král a římský císař z rodu Lucemburků. Roku 1348 založil pražskou univerzitu; roku 1357 začala stavba Karlova mostu.',image:'Charles IV Holy Roman Emperor portrait medieval'},
{title:'Praha za Lucemburků',text:'Ve 14. století se Praha stala významným evropským centrem. Karel IV. založil Nové Město pražské a podporoval výstavbu i vzdělanost.',image:'Charles Bridge Prague photograph'}],quiz:{q:'Ve kterém roce byla založena Univerzita Karlova?',a:'V roce 1348.'}}
];
