/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const { animals, employees, prices, hours } = require('./data');
// const data = require('./data');

// Requisito 1
const animalsByIds = (...ids) =>
  animals.filter((animal) => ids.some((id) => animal.id === id));

// Requisito 2
const animalsOlderThan = (animal, age) =>
  animals
    .find((name) => name.name === animal)
    .residents.every((ageOfAnimal) => ageOfAnimal.age >= age);

// Requisito 3
const employeeByName = (employeeName) => {
  const employeeObj = employees.find(
    (employee) =>
      employeeName === employee.firstName
      || employeeName === employee.lastName,
  );
  return employeeObj === undefined ? {} : employeeObj;
};

// Requisito 4
const createEmployee = (
  { id, firstName, lastName },
  { managers, responsibleFor },
) => ({ id, firstName, lastName, managers, responsibleFor });

// Requisito 5
const isManager = (id) =>
  employees.some((employee) =>
    employee.managers.some((idManager) => idManager === id));

// Requisito 6
const addEmployee = (
  id,
  firstName,
  lastName,
  managers = [],
  responsibleFor = [],
) => {
  const newObj = { id, firstName, lastName, managers, responsibleFor };
  employees.push(newObj);
};

// Requisito 7
const animalCount = (species) => {
  const ret = {};
  animals.forEach(({ name, residents }) => {
    ret[name] = residents.length;
  });
  return species === undefined
    ? ret
    : animals.find((animal) => animal.name === species).residents.length;
};

// Requisito 8
const entryCalculator = ({ Adult = 0, Child = 0, Senior = 0 } = 0) =>
  Adult * prices.Adult + Child * prices.Child + Senior * prices.Senior;

// Requisito 9
const addRegions = () => ({
  NE: [],
  NW: [],
  SE: [],
  SW: [],
});
const animalsByLocation = () => {
  const listByLocation = addRegions();
  animals.forEach((animal) => {
    listByLocation[animal.location].push(animal.name);
  });
  return listByLocation;
};

const getResidentsNames = (animalType) =>
  animalType.residents.map((animal) => animal.name);

const filterResidentsNamesBySex = (animalType, sex) =>
  animalType.residents
    .filter((animal) => animal.sex === sex)
    .map((resident) => resident.name);

const animalsByLocationAndName = (sorted, sex) => {
  const listByLocationAndName = addRegions();
  animals.forEach((animal) => {
    let residentsNames = '';
    if (sex) {
      residentsNames = filterResidentsNamesBySex(animal, sex);
    } else {
      residentsNames = getResidentsNames(animal);
    }
    if (sorted) {
      residentsNames.sort();
    }
    listByLocationAndName[animal.location].push({ [animal.name]: residentsNames });
  });
  return listByLocationAndName;
};

function animalMap(options) {
  if (!options || !options.includeNames) {
    return animalsByLocation();
  }
  const { includeNames, sorted, sex } = options;
  if (includeNames) {
    return animalsByLocationAndName(sorted, sex);
  }
}

// Requisito 10

const changeHour = (hour) => hour - 12;

const scheduleParameterUndefined = (day, open, close) => {
  if (day === 'Monday') {
    return 'CLOSED';
  }
  return `Open from ${open}am until ${changeHour(close)}pm`;
};

const schedule = (dayName) => {
  const entries = Object.entries(hours);
  const obj = entries.reduce((acc, x) => {
    const { open } = x[1];
    const { close } = x[1];
    const day = x[0];
    if (dayName === undefined) {
      acc[day] = scheduleParameterUndefined(day, open, close);
    } else if (dayName === 'Monday' && day === 'Monday') {
      acc[day] = 'CLOSED';
    } else if (dayName === day) {
      acc[day] = `Open from ${open}am until ${changeHour(close)}pm`;
    }
    return acc;
  }, {});

  return obj;
};

// Requisito 11

const getBigger = (bigger, number) => (
  bigger > number.age ? bigger : number.age);

const oldestFromFirstSpecies = (id) => {
  const employeeObj = employees.find((employee) => employee.id === id);
  const animalId = employeeObj.responsibleFor[0];
  const animalResidents = animals.find((animal) => animal.id === animalId)
    .residents;
  const oldestAnimalYears = animalResidents.reduce(getBigger, 0);
  const oldestAnimal = animalResidents.find(
    (animal) => animal.age === oldestAnimalYears,
  );
  return [oldestAnimal.name, oldestAnimal.sex, oldestAnimal.age];
};

// Requisito 12
const increasePrices = (percentage) => {
  const tickets = Object.keys(prices);

  tickets.forEach((ticketType) => {
    prices[ticketType] += prices[ticketType] * (percentage / 100);
    prices[ticketType] = Math.round(prices[ticketType] * 100) / 100;
  });
  return prices;
};

const responsibleFor = (employee) => employee.responsibleFor
  .map((id) => animals
    .find((animal) => animal.id === id).name);

const employeesResponsibleList = () => {
  const responsibleListByEmployee = {};
  employees.forEach((employee) => {
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    responsibleListByEmployee[employeeName] = responsibleFor(employee);
  });
  return responsibleListByEmployee;
};

const findEmployeeByIdNameOrLastName = (employeeData) => employees
  .find((employee) => employee.firstName === employeeData
    || employee.lastName === employeeData
    || employee.id === employeeData);

const animalsNameByEmployee = (employee) => {
  const employeeName = `${employee.firstName} ${employee.lastName}`;
  return { [employeeName]: responsibleFor(employee) };
};

const employeeAnimals = (employeeData) => {
  const employee = findEmployeeByIdNameOrLastName(employeeData);
  return animalsNameByEmployee(employee);
};

const employeeCoverage = (employeeData) => {
  if (!employeeData) {
    return employeesResponsibleList();
  }

  return employeeAnimals(employeeData);
};

// console.log(employeeCoverage());
module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
