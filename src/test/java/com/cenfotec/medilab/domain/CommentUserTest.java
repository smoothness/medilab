package com.cenfotec.medilab.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.medilab.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommentUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CommentUser.class);
        CommentUser commentUser1 = new CommentUser();
        commentUser1.setId(1L);
        CommentUser commentUser2 = new CommentUser();
        commentUser2.setId(commentUser1.getId());
        assertThat(commentUser1).isEqualTo(commentUser2);
        commentUser2.setId(2L);
        assertThat(commentUser1).isNotEqualTo(commentUser2);
        commentUser1.setId(null);
        assertThat(commentUser1).isNotEqualTo(commentUser2);
    }
}
