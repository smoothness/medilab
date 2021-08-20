interface InternalUserData {
  activated: boolean;
  authorities: string[];
  createdBy: string;
  createdDate: Date;
  email: string;
  firstName: string;
  id: number;
  imageUrl: string;
  langKey: string;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  lastName: string;
  login: string;
}

interface PatientUserData {
  id: number;
  internalUser: InternalUserData;
  phone: string;
  secondSurname: string;
  token: string;
}

interface DoctorUserData {
  id: number;
  internalUser: InternalUserData;
  specialty: string;
  phone: string;
  secondSurname: string;
  doctorCode: string;
}

abstract class PersonalData {
  public activated = false;
  public firstName = '';
  public email = '';
  public id = -1;
  public langKey = 'es';
  public lastName = '';
  public login = '';
  public authorities: string[];
  public imageUrl: string;

  protected constructor({ activated, firstName, email, id, langKey, lastName, login, authorities, imageUrl }: InternalUserData) {
    this.activated = activated;
    this.firstName = firstName;
    this.email = email;
    this.id = id;
    this.langKey = langKey;
    this.lastName = lastName;
    this.login = login;
    this.authorities = authorities;
    this.imageUrl = imageUrl;
  }

  get internalUserData(): {} {
    return {
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      langKey: this.langKey,
    };
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Patient extends PersonalData {
  public patientId: number;
  public phone: string;
  public secondSurname: string;
  public token: string;

  constructor({ id, internalUser, secondSurname, phone, token }: PatientUserData) {
    super(internalUser);
    this.patientId = id;
    this.phone = phone;
    this.secondSurname = secondSurname;
    this.token = token;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName} ${this.secondSurname || ""}`;
  }

  get patientData(): {} {
    return {
      id: this.patientId,
      internalUser: {
        id: this.id,
      },
      phone: this.phone,
      secondSurname: this.secondSurname,
      token: this.token,
    };
  }
  setToken(token: string): void{
    this.token = token;
  }
}

class Doctor extends PersonalData {
  public doctorId: number;
  public specialty: string;
  public phone: string;
  public secondSurname: string;
  public doctorCode: string;

  constructor({ id, internalUser, specialty, secondSurname, phone, doctorCode }: DoctorUserData) {
    super(internalUser);
    this.doctorId = id;
    this.specialty = specialty;
    this.phone = phone;
    this.secondSurname = secondSurname;
    this.doctorCode = doctorCode;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName} ${this.secondSurname || ""}`;
  }

  get doctorData(): {} {
    return {
      id: this.doctorId,
      internalUser: { id: this.id },
      specialty: this.specialty,
      phone: this.phone,
      secondSurname: this.secondSurname,
    };
  }
}

class Account extends PersonalData {
  constructor(accountData: InternalUserData) {
    super(accountData);
  }
}

export { Account, Patient, Doctor };
