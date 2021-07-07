package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.CommentUser;
import com.cenfotec.medilab.repository.CommentUserRepository;
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
 * Integration tests for the {@link CommentUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommentUserResourceIT {

    private static final String ENTITY_API_URL = "/api/comment-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommentUserRepository commentUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommentUserMockMvc;

    private CommentUser commentUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommentUser createEntity(EntityManager em) {
        CommentUser commentUser = new CommentUser();
        return commentUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommentUser createUpdatedEntity(EntityManager em) {
        CommentUser commentUser = new CommentUser();
        return commentUser;
    }

    @BeforeEach
    public void initTest() {
        commentUser = createEntity(em);
    }

    @Test
    @Transactional
    void createCommentUser() throws Exception {
        int databaseSizeBeforeCreate = commentUserRepository.findAll().size();
        // Create the CommentUser
        restCommentUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isCreated());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeCreate + 1);
        CommentUser testCommentUser = commentUserList.get(commentUserList.size() - 1);
    }

    @Test
    @Transactional
    void createCommentUserWithExistingId() throws Exception {
        // Create the CommentUser with an existing ID
        commentUser.setId(1L);

        int databaseSizeBeforeCreate = commentUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommentUserMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCommentUsers() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        // Get all the commentUserList
        restCommentUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commentUser.getId().intValue())));
    }

    @Test
    @Transactional
    void getCommentUser() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        // Get the commentUser
        restCommentUserMockMvc
            .perform(get(ENTITY_API_URL_ID, commentUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commentUser.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCommentUser() throws Exception {
        // Get the commentUser
        restCommentUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCommentUser() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();

        // Update the commentUser
        CommentUser updatedCommentUser = commentUserRepository.findById(commentUser.getId()).get();
        // Disconnect from session so that the updates on updatedCommentUser are not directly saved in db
        em.detach(updatedCommentUser);

        restCommentUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommentUser.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommentUser))
            )
            .andExpect(status().isOk());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
        CommentUser testCommentUser = commentUserList.get(commentUserList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commentUser.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommentUserWithPatch() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();

        // Update the commentUser using partial update
        CommentUser partialUpdatedCommentUser = new CommentUser();
        partialUpdatedCommentUser.setId(commentUser.getId());

        restCommentUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommentUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommentUser))
            )
            .andExpect(status().isOk());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
        CommentUser testCommentUser = commentUserList.get(commentUserList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateCommentUserWithPatch() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();

        // Update the commentUser using partial update
        CommentUser partialUpdatedCommentUser = new CommentUser();
        partialUpdatedCommentUser.setId(commentUser.getId());

        restCommentUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommentUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommentUser))
            )
            .andExpect(status().isOk());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
        CommentUser testCommentUser = commentUserList.get(commentUserList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commentUser.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommentUser() throws Exception {
        int databaseSizeBeforeUpdate = commentUserRepository.findAll().size();
        commentUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommentUserMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commentUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommentUser in the database
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommentUser() throws Exception {
        // Initialize the database
        commentUserRepository.saveAndFlush(commentUser);

        int databaseSizeBeforeDelete = commentUserRepository.findAll().size();

        // Delete the commentUser
        restCommentUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, commentUser.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CommentUser> commentUserList = commentUserRepository.findAll();
        assertThat(commentUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
