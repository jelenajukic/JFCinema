require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/user");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "Fedde",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: "fedde@fedde.nl",
    role: "USER"
  },
  {
    username: "Fedde-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'fedde@feddeadmin.nl',
    role: 'ADMIN'
  },
  {
    username: "Jelena",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelena.nl',
    role: 'USER'
  },
  {
    username: "Jelena-admin",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: 'Jelena@jelenaadmin.nl',
    role: 'ADMIN'
  }
]

// 522 random names
const randomName = [
  'Julia',
'Emma',
'Sophie',
'Tess',
'Zoë',
'Mila',
'Anna',
'Sara',
'Eva',
'Noor',
'Nora',
'Evi',
'Saar',
'Lotte',
'Lieke',
'Yara',
'Olivia',
'Liv',
'Lauren',
'Nova',
'Maud',
'Fenna',
'Nina',
'Sarah',
'Sofie',
'Fleur',
'Elin',
'Emily',
'Lynn',
'Milou',
'Roos',
'Lisa',
'Isa',
'Sofia',
'Hannah',
'Noa',
'Loïs',
'Feline',
'Lina',
'Maria',
'Mia',
'Ella',
'Hailey',
'Bo',
'Jasmijn',
'Julie',
'Sanne',
'Amy',
'Fien',
'Lena',
'Esmee',
'Lara',
'Amber',
'Sophia',
'Vera',
'Luna',
'Suze',
'Isabella',
'Anne',
'Liz',
'Lize',
'Ivy',
'Elena',
'Norah',
'Rosa',
'Femke',
'Lizzy',
'Fenne',
'Elise',
'Jill',
'Hanna',
'Charlotte',
'Naomi',
'Floor',
'Linde',
'Elif',
'Kiki',
'Cato',
'Lily',
'Fay',
'Puck',
'Evy',
'Tessa',
'Isabel',
'Livia',
'Veerle',
'Juul',
'Suus',
'Laura',
'Romy',
'Liva',
'Lola',
'Benthe',
'Demi',
'Jolie',
'Kate',
'Fiene',
'Johanna',
'Lana',
'Philou',
'Rosalie',
'Merel',
'Eline',
'Nola',
'Amira',
'Charlie',
'Sam',
'Mirthe',
'Inaya',
'Iris',
'Fem',
'Louise',
'Maya',
'Emilia',
'Chloë',
'Elisa',
'Jade',
'Nikki',
'Guusje',
'Pip',
'Lise',
'Aya',
'Chloé',
'Mara',
'Robin',
'Faye',
'Jackie',
'Senna',
'Isabelle',
'Sterre',
'Féline',
'Lot',
'Amélie',
'Marit',
'Yuna',
'Bente',
'Nore',
'Yfke',
'Jet',
'June',
'Nine',
'Esmée',
'Lilly',
'Stella',
'Amelia',
'Mare',
'Noëlle',
'Josephine',
'Mira',
'Vajèn',
'Pien',
'Anouk',
'Romée',
'Bobbi',
'Jinthe',
'Victoria',
'Beau',
'Janne',
'Jaylinn',
'Maryam',
'Elisabeth',
'Ava',
'Mae',
'Alina',
'Indy',
'Marie',
'Pleun',
'Zeynep',
'Aimée',
'Maja',
'Zoey',
'Zara',
'Silke',
'Jinte',
'Noé',
'Leah',
'Lieve',
'Janna',
'Juna',
'Ilse',
'Eliza',
'Isra',
'Joy',
'Mette',
'Valerie',
'Vesper',
'Ayla',
'Meryem',
'Lucy',
'Elizabeth',
'Liza',
'Ela',
'Phileine',
'Sena',
'Nienke',
'Soof',
'Hafsa',
'Madelief',
'Nour',
'Jessie',
'Lexi',
'Evie',
'Helena',
'Jula',
'Lou',
'Noortje',
'Bibi',
'Marly',
'Bella',
'Joëlle',
'Elina',
'Jolien',
'Juliette',
'Merle',
'Tara',
'Alicia',
'Amina',
'Myrthe',
'Layla',
'Marley',
'Yasmin',
'Azra',
'Ise',
'Lizz',
'Lois',
'Niene',
'Adriana',
'Esther',
'Imke',
'Liyana',
'Riley',
'Donna',
'Nadia',
'Gwen',
'Ize',
'Milena',
'Elize',
'Loes',
'Ruby',
'Cornelia',
'Hidaya',
'Jenna',
'Kensi',
'Alyssa',
'Vieve',
'Yasmine',
'Bobbie',
'Doris',
'Flore',
'Juliëtte',
'Megan',
'Meike',
'Pippa',
'Zuzanna',
'Dina',
'Jente',
'Keet',
'Nisa',
'Novi',
'Skye',
'Dani',
'Fayenne',
'Jane',
'Lea',
'Maysa',
'Selina',
'Vayèn',
'Farah',
'Linn',
'Puk',
'Yinthe',
'Aaliyah',
'Fatima',
'Giulia',
'Hanne',
'Liya',
'Maartje',
'Annabel',
'Mina',
'Catharina',
'Fayèn',
'Jailey',
'Romee',
'Valentina',
'Aylin',
'Coco',
'Femm',
'Filou',
'Jazzlyn',
'Kyra',
'Lune',
'Marwa',
'Nadine',
'Alice',
'Britt',
'Celine',
'Daphne',
'Miley',
'Rosie',
'Thirza',
'Angelina',
'Defne',
'Elynn',
'Fiep',
'Lott',
'Vive',
'Wies',
'Aisha',
'Ariana',
'Diede',
'Evelien',
'Jasmine',
'Florine',
'Hayley',
'Jara',
'Jolijn',
'Kira',
'Lexie',
'Lisanne',
'Neeltje',
'Nena',
'Renske',
'Ziva',
'Dana',
'Esma',
'Febe',
'Jip',
'Noëlla',
'Sammie',
'Tirza',
'Asiya',
'Dewi',
'Floortje',
'Jana',
'Kenza',
'Leyla',
'Lilou',
'Maren',
'Safae',
'Abigail',
'Djenna',
'Eleysa',
'Jalou',
'Jayda',
'Liliana',
'Maan',
'Selena',
'Abby',
'Alya',
'Amaya',
'Carmen',
'Cataleya',
'Inara',
'Jette',
'Maeve',
'Meyra',
'Ninthe',
'Claire',
'Emmy',
'Hendrika',
'Nika',
'Carlijn',
'Danique',
'Fayen',
'Jacky',
'Jess',
'Jesslynn',
'Kayleigh',
'Madée',
'Salomé',
'Selma',
'Viënna',
'Alexandra',
'Alma',
'Babette',
'Christina',
'Jaelynn',
'Myla',
'Nila',
'Rose',
'Sienna',
'Vayen',
'Zofia',
'Jule',
'Lucie',
'Melody',
'Milana',
'Mirre',
'Aliyah',
'Daantje',
'Daisy',
'Eleanor',
'Elodie',
'Hira',
'Karlijn',
'Luus',
'Maaike',
'Nynke',
'Aurora',
'Chelsea',
'Davina',
'Esra',
'Faith',
'Jada',
'Liselot',
'Louisa',
'Lux',
'Melissa',
'Wilhelmina',
'Aleyna',
'Amelie',
'Arya',
'Bowie',
'Famke',
'Jazzlynn',
'Kiara',
'Kyara',
'Macy',
'Maxime',
'Willemijn',
'Yenthe',
'Aimy',
'Aukje',
'Bregje',
'Faya',
'Felien',
'Freya',
'Imane',
'Josefien',
'Kaylee',
'Khadija',
'Malak',
'Sanna',
'Wiktoria',
'Zehra',
'Asya',
'Ceylin',
'Chloe',
'Eveline',
'Faylinn',
'Hiba',
'Imme',
'Janneke',
'Jenthe',
'Jesslyn',
'Linne',
'Lis',
'Loa',
'Mariam',
'Mayra',
'Miray',
'Neva',
'Nomi',
'Sifra',
'Tasnim',
'Zahra',
'Annabelle',
'Fardau',
'Hajar',
'Ines',
'Jaimy',
'Jennifer',
'Michelle',
'Yana',
'Aaltje',
'Aivy',
'Amani',
'Amara',
'Ayana',
'Eleonora',
'Eliana',
'Jacoba',
'Jazz',
'Jolene',
'Lenne',
'Liene',
'Liselotte',
'Meghan',
'Mieke',
'Mirte',
'Sare',
'Scottie',
'Vayenna',
'Vienna',
'Wende',
'Yarah',
'Chiara',
'Cleo',
'Eliz',
'Elle',
'Emilie',
'Gigi',
'Imani',
'Isabeau',
'Israe',
'Izzy',
'Jaylin',
'Lia',
'Quinn',
'Rebecca',
'Sue',
'Vanessa',
'Amalia',
'Diana',
'Dilara',
'Esila',
'Felicia',
'Fieke',
'Gaia',
'Joanna',
'Juno',
'Laure',
'Lente',
'Manou',
'Mijs',
'Nada',
'Natalia',
'Nicole',
'Oumayra',
'Romaysa',
'Ronja',
'Soraya'
]

randomName.forEach(name => {
  var newUser = {
    username: name,
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    email: `${name}@jfcinema.eu`,
    role: "USER"
  }
  users.push(newUser);
})


//  User.create(users)
// -> If you want to delete the current users, use this instead of User.create(users)
User.deleteMany()
  .then(() => {
    return User.create(users)
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with:`);
    mongoose.disconnect();
    console.log('DB: connection closed')
  })
  .catch(err => {
    mongoose.disconnect();
    console.log('DB connection closed with error: ', err);
  })


