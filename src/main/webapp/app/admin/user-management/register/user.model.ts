import {EmergencyContact} from "./../../../account/register/register.model";

interface newUserData {
  personalInfo: {
    login: string;
    name: string;
    lastname: string;
    secondlastname: string;
    langKey: string;
    specialty: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  role: string;
  specialty?: string;
}

interface registration {
  login: string;
  firstName: string;
  lastName: string;
  langKey: string;
  email: string;
  authorities?: string[];
}

interface patientInfo {
  internalUser: { id: number };
  secondSurname: string;
  phone: string;
}

abstract class PersonalInfo {
  name = '';
  lastname = '';
  secondlastname = '';
}

class User extends PersonalInfo {
  authorities: string[] = [];
  activated?: boolean;
  emergencyContact?: EmergencyContact;
  doctorCode?: string;
  specialty?: string | null;
  login: string;
  langKey: string;
  phone: string;
  email: string;
  role?: string;
  id = -1;
  password = '';

  constructor({ personalInfo, contactInfo, role, specialty}: newUserData) {
    super();
    this.login = personalInfo.login;
    this.name = personalInfo.name;
    this.lastname = personalInfo.lastname;
    this.secondlastname = personalInfo.secondlastname;
    this.langKey = personalInfo.langKey;
    this.phone = contactInfo.phone;
    this.email = contactInfo.email;
    this.role = role;
    this.specialty = specialty ?? null;
    this.authorities = [this.role]
  }

  public get data(): registration {
    return {
      login: this.login,
      firstName: this.name,
      lastName: this.lastname,
      langKey: this.langKey,
      email: this.email,
      authorities: this.authorities
    };
  }

  public get doctorData(): { specialty: string | null | undefined; internalUser: { id: number } } {
    return {
      specialty: this.specialty,
      internalUser: {
        id: this.id,
      },
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
  }

  public setEmergencyConctacId(): void {
    (<any>this.emergencyContact).patient = this.id;
  }

}

export { User }
