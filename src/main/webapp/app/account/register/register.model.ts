interface newUserData {
  personalInfo: {
    login: string;
    name: string;
    lastname: string;
    secondlastname: string;
    langKey: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  emergencyContact: EmergencyContact;
}

interface fromContactData {
  name: string;
  lastname: string;
  secondLastname: string;
  phone: string;
  email: string;
  relationship: string;
}

interface registration {
  login: string;
  firstName: string;
  lastName: string;
  langKey: string;
  email: string;
  password: string;
}

interface patientInfo {
  secondSurname: string;
  phone: string;
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

export class EmergencyContact extends PersonalInfo {
  phone: string;
  email: string;
  relationship: string;

  constructor({ name, lastname, secondLastname, phone, email, relationship }: fromContactData) {
    super();
    this.name = name;
    this.lastname = lastname;
    this.secondlastname = secondLastname;
    this.phone = phone;
    this.email = email;
    this.relationship = relationship;
  }

  get fullName(): string {
    return `${this.name} ${this.lastname} ${this.secondlastname}`;
  }

  get registerData(): { name: string; phone: string; email: string; relationship: string } {
    return {
      name: this.fullName,
      phone: this.phone,
      email: this.email,
      relationship: this.relationship,
    };
  }
}

export class User extends PersonalInfo {
  login: string;
  langKey: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact[] = [];
  id: number;

  constructor({ personalInfo, contactInfo, emergencyContact }: newUserData) {
    super();
    this.login = personalInfo.login;
    this.name = personalInfo.name;
    this.lastname = personalInfo.lastname;
    this.secondlastname = personalInfo.secondlastname;
    this.langKey = personalInfo.langKey;
    this.phone = contactInfo.phone;
    this.email = contactInfo.email;
    this.id = -1;
    this.emergencyContact.push(emergencyContact);
  }

  get data(): registration {
    return {
      login: this.login,
      firstName: this.name,
      lastName: this.lastname,
      langKey: this.langKey,
      email: this.email,
      password: 'test',
    };
  }

  get patientData(): patientInfo {
    return {
      secondSurname: this.secondlastname,
      phone: this.phone,
    };
  }

  setId({ id }: { id: number }): void {
    this.id = id;
  }
}
