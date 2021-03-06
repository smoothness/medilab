package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.Binnacle;
import com.cenfotec.medilab.domain.Patient;
import com.cenfotec.medilab.domain.User;
import com.cenfotec.medilab.repository.PatientRepository;
import com.cenfotec.medilab.repository.UserRepository;
import com.cenfotec.medilab.service.BinnacleService;
import com.cenfotec.medilab.service.PatientService;
import com.cenfotec.medilab.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import javax.validation.Valid;

import com.cenfotec.medilab.web.rest.errors.InvalidTokenException;
import com.cenfotec.medilab.web.rest.vm.TokenVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.security.RandomUtil;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.medilab.domain.Patient}.
 */
@RestController
@RequestMapping("/api")
public class PatientResource {

    private final Logger log = LoggerFactory.getLogger(PatientResource.class);

    private static final String ENTITY_NAME = "patient";

    @Autowired
    UserRepository userRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PatientService patientService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private BinnacleService binnacleService;

    private final PatientRepository patientRepository;

    public PatientResource(PatientService patientService, PatientRepository patientRepository) {
        this.patientService = patientService;
        this.patientRepository = patientRepository;
    }

    /**
     * {@code POST  /patients} : Create a new patient.
     *
     * @param patient the patient to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new patient, or with status {@code 400 (Bad Request)} if the patient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) throws URISyntaxException {
        log.debug("REST request to save Patient : {}", patient);
        if (patient.getId() != null) {
            throw new BadRequestAlertException("A new patient cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<User> thisUser = userRepository.findById(patient.getInternalUser().getId());

        if (thisUser == null) {
            throw new BadRequestAlertException("User dont exist", "User", "idexists");
        }

        patient.setInternalUser(thisUser.get());
        Patient result = patientService.save(patient);
        return ResponseEntity.ok(result);
    }

    /**
     * {@code PUT  /patients/:id} : Updates an existing patient.
     *
     * @param id the id of the patient to save.
     * @param patient the patient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated patient,
     * or with status {@code 400 (Bad Request)} if the patient is not valid,
     * or with status {@code 500 (Internal Server Error)} if the patient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable(value = "id", required = false) final Long id, @RequestBody Patient patient)
        throws URISyntaxException {
        log.debug("REST request to update Patient : {}, {}", id, patient);
        if (patient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, patient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!patientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Patient result = patientService.save(patient);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, patient.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /patients/:id} : Partial updates given fields of an existing patient, field will ignore if it is null
     *
     * @param id the id of the patient to save.
     * @param patient the patient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated patient,
     * or with status {@code 400 (Bad Request)} if the patient is not valid,
     * or with status {@code 404 (Not Found)} if the patient is not found,
     * or with status {@code 500 (Internal Server Error)} if the patient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/patients/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Patient> partialUpdatePatient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Patient patient
    ) throws URISyntaxException {
        log.debug("REST request to partial update Patient partially : {}, {}", id, patient);
        if (patient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, patient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!patientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Patient> result = patientService.partialUpdate(patient);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, patient.getId().toString())
        );
    }

    /**
     * {@code GET  /patients} : get all the patients.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of patients in body.
     */
    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        log.debug("REST request to get all Patients");
        return patientService.findAll();
    }

    /**
     * {@code GET  /patients/:id} : get the "id" patient.
     *
     * @param id the id of the patient to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the patient, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable Long id) {
        log.debug("REST request to get Patient : {}", id);
        Optional<Patient> patient = patientService.findOne(id);
        return ResponseUtil.wrapOrNotFound(patient);
    }

    @GetMapping("/patient/{id}")
    public ResponseEntity<Patient> getPatientByInternalUser(@PathVariable Long id) {
        log.debug("REST request to get Patient : {}", id);
        Patient patient = patientService.findByInternalUser(id);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/patient-appointment/{id}")
    public ResponseEntity<Patient> getPatientByAppointment(@PathVariable Long id) {
        Patient patient = patientService.findPatientByAppointment(id);
        return ResponseEntity.ok(patient);
    }

    /**
     * {@code DELETE  /patients/:id} : delete the "id" patient.
     *
     * @param id the id of the patient to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        log.debug("REST request to delete Patient : {}", id);
        patientService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping(path = "/token/{id}")
    public ResponseEntity<Patient> createToken(@PathVariable Long id, @RequestBody Patient patient) {
        if(patient.getId() == null){
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, patient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!patientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        patient.setToken(generateToken());
        Patient updatedPatient = patientRepository.save(patient);
        return ResponseEntity.ok(updatedPatient);
    }

    @PostMapping(path = "/token")
    public ResponseEntity<Patient> queryByToken(@RequestBody TokenVM tokenVM) {
        Optional<Patient> patient = isInvalidToken(tokenVM.getKey());
        if (!patient.isPresent()) {
            throw new InvalidTokenException();
        }
        patient.get().setToken(null);

        saveBinnacle(tokenVM.getDoctorCode(), patient.get());

        Patient patientConsulted = this.patientRepository.save(patient.get());

        return ResponseEntity.ok(patientConsulted);
    }

    private Optional<Patient> isInvalidToken(String key) {
        Optional<Patient> patient = patientService.findPatientByToken(key);
        return patient;
    }

    private String generateToken() {
        Random ran = new Random();
        int top = 5;
        char data = ' ';
        String dat = "";

        for (int i=0; i <= top; i++) {
            data = (char)(ran.nextInt(25)+97);
            dat = data + dat;
        }
        return dat.toUpperCase();
    }


    private void saveBinnacle(String doctorCode, Patient patient){
        Binnacle binnacle = new Binnacle();
        binnacle.setPatient(patient);
        binnacle.setDate(LocalDate.now());
        binnacle.setDoctorCode(doctorCode);
        binnacleService.save(binnacle);
    }
}
