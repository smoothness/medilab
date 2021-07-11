interface newUserData {
  personalInfo: {
    login: string;
    name: string;
    lastname: string;
    secondlastname: string;
    langKey: string;
  },
  contactInfo: {
    phone: string;
    email: string;
  },
  emergencyContact: EmergencyContact 
}

interface registration {
  login: string;
  firstName: string;
  lastName: string;
  langKey: string;
  email: string;
  password: string;
}

abstract class PersonalInfo {
  name: string;
  lastname: string;
  secondlastname: string;

  constructor() {
    this.name = '';
    this.lastname = '';
    this.secondlastname = '';
  }
}

class EmergencyContact extends PersonalInfo {
  phone: string;
  email: string;

  constructor(){
    super();
    this.phone = '';
    this.email = '';
  }
}

export class User extends PersonalInfo {
  login: string;
  langKey: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact[] = [];

  constructor({personalInfo, contactInfo, emergencyContact}: newUserData) {
    super();
    this.login = personalInfo.login;
    this.name = personalInfo.name;
    this.lastname= personalInfo.lastname;
    this.secondlastname= personalInfo.secondlastname;
    this.langKey= personalInfo.langKey;
    this.phone= contactInfo.phone;
    this.email= contactInfo.email;
    this.emergencyContact.push(emergencyContact);
  }

  get data(): registration {
    return {
      login: this.login,
      firstName: this.name,
      lastName: this.lastname,
      langKey: this.langKey,
      email: this.email,
      password: "test"
    }
  }
}
