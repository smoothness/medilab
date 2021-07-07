package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.RatingUser;
import com.cenfotec.medilab.repository.RatingUserRepository;
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
 * Integration tests for the {@link RatingUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RatingUserResourceIT {

    private static final String ENTITY_API_URL = "/api/rating-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RatingUserRepository ratingUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRatingUserMockMvc;

    private RatingUser ratingUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RatingUser createEntity(EntityManager em) {
        RatingUser ratingUser = new RatingUser();
        return ratingUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RatingUser createUpdatedEntity(EntityManager em) {
        RatingUser ratingUser = new RatingUser();
        return ratingUser;
    }

    @BeforeEach
    public void initTest() {
        ratingUser = createEntity(em);
    }

    @Test
    @Transactional
    void createRatingUser() throws Exception {
        int databaseSizeBeforeCreate = ratingUserRepository.findAll().size();
        // Create the RatingUser
        restRatingUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isCreated());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeCreate + 1);
        RatingUser testRatingUser = ratingUserList.get(ratingUserList.size() - 1);
    }

    @Test
    @Transactional
    void createRatingUserWithExistingId() throws Exception {
        // Create the RatingUser with an existing ID
        ratingUser.setId(1L);

        int databaseSizeBeforeCreate = ratingUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRatingUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRatingUsers() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        // Get all the ratingUserList
        restRatingUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ratingUser.getId().intValue())));
    }

    @Test
    @Transactional
    void getRatingUser() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        // Get the ratingUser
        restRatingUserMockMvc
            .perform(get(ENTITY_API_URL_ID, ratingUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ratingUser.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingRatingUser() throws Exception {
        // Get the ratingUser
        restRatingUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRatingUser() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();

        // Update the ratingUser
        RatingUser updatedRatingUser = ratingUserRepository.findById(ratingUser.getId()).get();
        // Disconnect from session so that the updates on updatedRatingUser are not directly saved in db
        em.detach(updatedRatingUser);

        restRatingUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRatingUser.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRatingUser))
            )
            .andExpect(status().isOk());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
        RatingUser testRatingUser = ratingUserList.get(ratingUserList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ratingUser.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRatingUserWithPatch() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();

        // Update the ratingUser using partial update
        RatingUser partialUpdatedRatingUser = new RatingUser();
        partialUpdatedRatingUser.setId(ratingUser.getId());

        restRatingUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRatingUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRatingUser))
            )
            .andExpect(status().isOk());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
        RatingUser testRatingUser = ratingUserList.get(ratingUserList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateRatingUserWithPatch() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();

        // Update the ratingUser using partial update
        RatingUser partialUpdatedRatingUser = new RatingUser();
        partialUpdatedRatingUser.setId(ratingUser.getId());

        restRatingUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRatingUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRatingUser))
            )
            .andExpect(status().isOk());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
        RatingUser testRatingUser = ratingUserList.get(ratingUserList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ratingUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRatingUser() throws Exception {
        int databaseSizeBeforeUpdate = ratingUserRepository.findAll().size();
        ratingUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRatingUserMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ratingUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RatingUser in the database
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRatingUser() throws Exception {
        // Initialize the database
        ratingUserRepository.saveAndFlush(ratingUser);

        int databaseSizeBeforeDelete = ratingUserRepository.findAll().size();

        // Delete the ratingUser
        restRatingUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, ratingUser.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RatingUser> ratingUserList = ratingUserRepository.findAll();
        assertThat(ratingUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
