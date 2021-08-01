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
  password: string;
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
  internalUser: { id: number };
  secondSurname: string;
  phone: string;
}

interface emergencyContactRegisterData {
  name: string;
  phone: string;
  email: string;
  relationShip: string;
  patient: { id: number };
}

abstract class PersonalInfo {
  name = '';
  lastname = '';
  secondlastname = '';
}

class EmergencyContact extends PersonalInfo {
  patient = -1;
  phone: string;
  email: string;
  relationship: string;

  constructor({ name, lastname, secondLastname, phone, email, relationship }: fromContactData) {
    super();
    this.name = name;
    this.lastname = lastname;
    this.secondlastname = secondLastname || '';
    this.phone = phone;
    this.email = email;
    this.relationship = relationship;
  }

  public get fullName(): string {
    return `${this.name} ${this.lastname} ${this.secondlastname}`;
  }

  public get registerContact(): emergencyContactRegisterData {
    return {
      name: this.fullName,
      phone: this.phone,
      email: this.email,
      relationShip: this.relationship,
      patient: {
        id: this.patient,
      },
    };
  }
}

class User extends PersonalInfo {
  login: string;
  langKey: string;
  phone: string;
  email: string;
  emergencyContact: EmergencyContact[] = [];
  id = -1;
  password = '';

  constructor({ personalInfo, contactInfo, password }: newUserData) {
    super();
    this.login = personalInfo.login;
    this.name = personalInfo.name;
    this.lastname = personalInfo.lastname;
    this.secondlastname = personalInfo.secondlastname;
    this.langKey = personalInfo.langKey;
    this.phone = contactInfo.phone;
    this.email = contactInfo.email;
    this.password = password;
  }

  public get data(): registration {
    return {
      login: this.login,
      firstName: this.name,
      lastName: this.lastname,
      langKey: this.langKey,
      email: this.email,
      password: this.password,
    };
  }

  public get patientData(): patientInfo {
    return {
      secondSurname: this.secondlastname,
      phone: this.phone,
      internalUser: {
        id: this.id,
      },
    };
  }

  public setId({ id }: { id: number }): void {
    this.id = id;
    for (const contact of this.emergencyContact) {
      contact.patient = this.id;
    }
  }

  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }

  public addEmergencyContactList(emergencyContact: EmergencyContact[]): void {
    this.emergencyContact = emergencyContact;
  }
}

export { User, EmergencyContact, emergencyContactRegisterData };
