package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import com.cenfotec.medilab.repository.AppointmentTreatmentAilmentRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AppointmentTreatmentAilmentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppointmentTreatmentAilmentResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_REMOVED = false;
    private static final Boolean UPDATED_REMOVED = true;

    private static final String ENTITY_API_URL = "/api/appointment-treatment-ailments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppointmentTreatmentAilmentRepository appointmentTreatmentAilmentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppointmentTreatmentAilmentMockMvc;

    private AppointmentTreatmentAilment appointmentTreatmentAilment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentTreatmentAilment createEntity(EntityManager em) {
        AppointmentTreatmentAilment appointmentTreatmentAilment = new AppointmentTreatmentAilment()
            .description(DEFAULT_DESCRIPTION)
            .removed(DEFAULT_REMOVED);
        return appointmentTreatmentAilment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentTreatmentAilment createUpdatedEntity(EntityManager em) {
        AppointmentTreatmentAilment appointmentTreatmentAilment = new AppointmentTreatmentAilment()
            .description(UPDATED_DESCRIPTION)
            .removed(UPDATED_REMOVED);
        return appointmentTreatmentAilment;
    }

    @BeforeEach
    public void initTest() {
        appointmentTreatmentAilment = createEntity(em);
    }

    @Test
    @Transactional
    void createAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeCreate = appointmentTreatmentAilmentRepository.findAll().size();
        // Create the AppointmentTreatmentAilment
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isCreated());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeCreate + 1);
        AppointmentTreatmentAilment testAppointmentTreatmentAilment = appointmentTreatmentAilmentList.get(
            appointmentTreatmentAilmentList.size() - 1
        );
        assertThat(testAppointmentTreatmentAilment.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAppointmentTreatmentAilment.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void createAppointmentTreatmentAilmentWithExistingId() throws Exception {
        // Create the AppointmentTreatmentAilment with an existing ID
        appointmentTreatmentAilment.setId(1L);

        int databaseSizeBeforeCreate = appointmentTreatmentAilmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAppointmentTreatmentAilments() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        // Get all the appointmentTreatmentAilmentList
        restAppointmentTreatmentAilmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointmentTreatmentAilment.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].removed").value(hasItem(DEFAULT_REMOVED.booleanValue())));
    }

    @Test
    @Transactional
    void getAppointmentTreatmentAilment() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        // Get the appointmentTreatmentAilment
        restAppointmentTreatmentAilmentMockMvc
            .perform(get(ENTITY_API_URL_ID, appointmentTreatmentAilment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appointmentTreatmentAilment.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.removed").value(DEFAULT_REMOVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAppointmentTreatmentAilment() throws Exception {
        // Get the appointmentTreatmentAilment
        restAppointmentTreatmentAilmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAppointmentTreatmentAilment() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();

        // Update the appointmentTreatmentAilment
        AppointmentTreatmentAilment updatedAppointmentTreatmentAilment = appointmentTreatmentAilmentRepository
            .findById(appointmentTreatmentAilment.getId())
            .get();
        // Disconnect from session so that the updates on updatedAppointmentTreatmentAilment are not directly saved in db
        em.detach(updatedAppointmentTreatmentAilment);
        updatedAppointmentTreatmentAilment.description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);

        restAppointmentTreatmentAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAppointmentTreatmentAilment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAppointmentTreatmentAilment))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
        AppointmentTreatmentAilment testAppointmentTreatmentAilment = appointmentTreatmentAilmentList.get(
            appointmentTreatmentAilmentList.size() - 1
        );
        assertThat(testAppointmentTreatmentAilment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAppointmentTreatmentAilment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void putNonExistingAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appointmentTreatmentAilment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppointmentTreatmentAilmentWithPatch() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();

        // Update the appointmentTreatmentAilment using partial update
        AppointmentTreatmentAilment partialUpdatedAppointmentTreatmentAilment = new AppointmentTreatmentAilment();
        partialUpdatedAppointmentTreatmentAilment.setId(appointmentTreatmentAilment.getId());

        partialUpdatedAppointmentTreatmentAilment.description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);

        restAppointmentTreatmentAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentTreatmentAilment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppointmentTreatmentAilment))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
        AppointmentTreatmentAilment testAppointmentTreatmentAilment = appointmentTreatmentAilmentList.get(
            appointmentTreatmentAilmentList.size() - 1
        );
        assertThat(testAppointmentTreatmentAilment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAppointmentTreatmentAilment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void fullUpdateAppointmentTreatmentAilmentWithPatch() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();

        // Update the appointmentTreatmentAilment using partial update
        AppointmentTreatmentAilment partialUpdatedAppointmentTreatmentAilment = new AppointmentTreatmentAilment();
        partialUpdatedAppointmentTreatmentAilment.setId(appointmentTreatmentAilment.getId());

        partialUpdatedAppointmentTreatmentAilment.description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);

        restAppointmentTreatmentAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentTreatmentAilment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppointmentTreatmentAilment))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
        AppointmentTreatmentAilment testAppointmentTreatmentAilment = appointmentTreatmentAilmentList.get(
            appointmentTreatmentAilmentList.size() - 1
        );
        assertThat(testAppointmentTreatmentAilment.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAppointmentTreatmentAilment.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void patchNonExistingAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appointmentTreatmentAilment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppointmentTreatmentAilment() throws Exception {
        int databaseSizeBeforeUpdate = appointmentTreatmentAilmentRepository.findAll().size();
        appointmentTreatmentAilment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentTreatmentAilmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentTreatmentAilment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentTreatmentAilment in the database
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppointmentTreatmentAilment() throws Exception {
        // Initialize the database
        appointmentTreatmentAilmentRepository.saveAndFlush(appointmentTreatmentAilment);

        int databaseSizeBeforeDelete = appointmentTreatmentAilmentRepository.findAll().size();

        // Delete the appointmentTreatmentAilment
        restAppointmentTreatmentAilmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, appointmentTreatmentAilment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppointmentTreatmentAilment> appointmentTreatmentAilmentList = appointmentTreatmentAilmentRepository.findAll();
        assertThat(appointmentTreatmentAilmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
