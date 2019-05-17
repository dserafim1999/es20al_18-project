package com.example.tutor.image;

import com.example.tutor.question.Question;

import javax.persistence.*;
import java.io.Serializable;

@Entity(name = "Image")
@Table(name = "images")
public class Image implements Serializable {

    @Id
    @Column(name = "question_id")
    private Integer question_id;

    @OneToOne
    @PrimaryKeyJoinColumn(name="question_id", referencedColumnName="image_id")
    private Question question;

    @Column(columnDefinition = "url")
    private String url;

    @Column(columnDefinition = "width")
    private Integer width;

    public Integer getQuestion_id() {
        return question_id;
    }

    public void setQuestion_id(Integer question_id) {
        this.question_id = question_id;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    @Override
    public String toString() {
        return "Url:" + this.getUrl() + ", Width: " + this.getWidth().toString();
    }
}