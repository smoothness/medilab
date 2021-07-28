package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.Appointment;
import com.cenfotec.medilab.repository.AppointmentRepository;
import com.cenfotec.medilab.service.AppointmentService;
import com.cenfotec.medilab.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.medilab.domain.Appointment}.
 */
@RestController
@RequestMapping("/api")
public class AppointmentResource {

    private final Logger log = LoggerFactory.getLogger(AppointmentResource.class);

    private static final String ENTITY_NAME = "appointment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppointmentService appointmentService;

    private final AppointmentRepository appointmentRepository;

    public AppointmentResource(AppointmentService appointmentService, AppointmentRepository appointmentRepository) {
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * {@code POST  /appointments} : Create a new appointment.
     *
     * @param appointment the appointment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appointment, or with status {@code 400 (Bad Request)} if the appointment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) throws URISyntaxException {
        log.debug("REST request to save Appointment : {}", appointment);
        if (appointment.getId() != null) {
            throw new BadRequestAlertException("A new appointment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Appointment result = appointmentService.save(appointment);
        return ResponseEntity
            .created(new URI("/api/appointments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /appointments/:id} : Updates an existing appointment.
     *
     * @param id the id of the appointment to save.
     * @param appointment the appointment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointment,
     * or with status {@code 400 (Bad Request)} if the appointment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appointment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> updateAppointment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Appointment appointment
    ) throws URISyntaxException {
        log.debug("REST request to update Appointment : {}, {}", id, appointment);
        if (appointment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Appointment result = appointmentService.save(appointment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /appointments/:id} : Partial updates given fields of an existing appointment, field will ignore if it is null
     *
     * @param id the id of the appointment to save.
     * @param appointment the appointment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointment,
     * or with status {@code 400 (Bad Request)} if the appointment is not valid,
     * or with status {@code 404 (Not Found)} if the appointment is not found,
     * or with status {@code 500 (Internal Server Error)} if the appointment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/appointments/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Appointment> partialUpdateAppointment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Appointment appointment
    ) throws URISyntaxException {
        log.debug("REST request to partial update Appointment partially : {}, {}", id, appointment);
        if (appointment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Appointment> result = appointmentService.partialUpdate(appointment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointment.getId().toString())
        );
    }

    /**
     * {@code GET  /appointments} : get all the appointments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appointments in body.
     */
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        log.debug("REST request to get all Appointments");
        return appointmentService.findAll();
    }

    /**
     * {@code GET  /appointments/:id} : get the "id" appointment.
     *
     * @param id the id of the appointment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appointment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        log.debug("REST request to get Appointment : {}", id);
        Optional<Appointment> appointment = appointmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(appointment);
    }

    /**
     * {@code GET  /appointments-doctor/:id} : get the "id" doctor.
     *
     * @param id the id of the doctor to retrieve all appointments.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the list of appointments, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/appointments-doctor/{id}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long id) {
        List<Appointment> appointments = appointmentService.findDoctorAppointments(id);
        return ResponseEntity.ok(appointments);
    }

    /**
     * {@code DELETE  /appointments/:id} : delete the "id" appointment.
     *
     * @param id the id of the appointment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        log.debug("REST request to delete Appointment : {}", id);
        appointmentService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
