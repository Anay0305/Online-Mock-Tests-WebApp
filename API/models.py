from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import random

def generate_random_test_id():
    return random.randint(100000000000, 999999999999)

class Subject(models.TextChoices):
    MATH = 'Mathematics', 'Mathematics'
    PHYSICS = 'Physics', 'Physics'
    CHEMISTRY = 'Chemistry', 'Chemistry'

class QuestionType(models.TextChoices):
    SCQ = 'SCQ', 'Single Choice Question'
    MCQ = 'MCQ', 'Multiple Choice Question'
    PARAGRAPH1 = 'Paragraph 1', 'Paragraph 1 Questions'
    PARAGRAPH2 = 'Paragraph 2', 'Paragraph 2 Questions'
    PARAGRAPH3 = 'Paragraph 4', 'Paragraph 3 Questions'
    MATCHING = 'Matching', 'Matching Type Questions'
    INTEGER = 'Integer', 'Integer based Question'
    DIGIT = 'Single Digit', 'Single Digit Integer based Question'

class Attempt(models.Model):
    username = models.TextField(primary_key=True)
    data = models.JSONField(default=dict)

class Test(models.Model):
    TestId = models.BigIntegerField(primary_key=True, default=generate_random_test_id, editable=False)
    Name = models.CharField(blank=False, max_length=100)
    Time = models.IntegerField(default=180, help_text="Enter time in Minutes", blank=False, null=False)
    Questions = models.IntegerField(verbose_name="Number of Questions", blank=False, null=False)
    scq = models.IntegerField(default=0, verbose_name="Number of Single Correct Questions")
    mcq = models.IntegerField(default=0, verbose_name="Number of Multiple Correct Questions")
    paragraph = models.CharField(max_length=20, default="0", verbose_name="Number of Paragraph Questions", help_text="Enter as Questions, Sub-Questions like There are 2 Paragraphs having 3 Sub questions, then enter 2, 3")
    matching = models.IntegerField(default=0, verbose_name="Number of Matching Questions")
    integer = models.IntegerField(default=0, verbose_name="Number of Integer Questions")
    singledigit = models.IntegerField(default=0, verbose_name="Number of Single Digit Questions")
    Total = models.IntegerField(verbose_name="Total Marks", default=0, help_text="It will get auto evaluated as you enter marking scheme in furter setup.")
    
    def clean(self):
        if self.Questions == 0:
            raise ValidationError({"Questions": "Number of Questions cannot be 0"})
        if self.Questions%3 != 0:
            raise ValidationError({"Questions": "Number of Questions should be a multiple of 3 to distribute it equally in three subjects."})
        if self.paragraph != "0":
            x = self.paragraph.split(",")
            if len(x) != 2:
                raise ValidationError({"paragraph": "Number of Paragraph questions not in correct format"})
            else:
                try:
                    main_paragraph = int(x[0].strip())
                    sub_paragraph = int(x[1].strip())
                except:
                    raise ValidationError({"paragraph": "Number of Paragraph questions should contain only , or digits"})
        else:
            main_paragraph = 0
            sub_paragraph = 0
        total = self.scq + self.mcq + (main_paragraph*sub_paragraph) + self.matching + self.integer + self.singledigit
        if self.Questions != total*3:
            raise ValidationError("The sum of number of questions of all types doesn't matches to total number of questions")

    def get_question_types(self):
        test = self
        types = {}
        main_paragraph = 0
        sub_paragraph = 0
        if len(test.paragraph.split(",")) == 2:
            main_paragraph = test.paragraph.split(",")[0].strip()
            sub_paragraph = test.paragraph.split(",")[1].strip()
        if test.scq != 0:
            types["SCQ"] = test.scq
        if test.mcq != 0:
            types["MCQ"] = test.mcq
        if main_paragraph >= 1:
            types["PARAGRAPH I"] = sub_paragraph
        if main_paragraph >= 2:
            types["PARAGRAPH II"] = sub_paragraph
        if main_paragraph >= 3:
            types["PARAGRAPH III"] = sub_paragraph
        if test.singledigit != 0:
            types["DIGIT"] = test.singledigit
        if test.integer != 0:
            types["INTEGER"] = test.integer
        if test.matching != 0:
            types["MATCHING"] = test.matching
        return types

    def save(self, *args, **kwargs):
        if not self.TestId:
            self.TestId = generate_random_test_id()
            while Test.objects.filter(TestId=self.TestId).exists():
                self.TestId = generate_random_test_id()
        self.full_clean()
        super().save(*args, **kwargs)

        main_paragraph = 0
        sub_paragraph = 0
        if self.paragraph != "0":
            x = self.paragraph.split(",")
            main_paragraph = int(x[0].strip())
            sub_paragraph = int(x[1].strip())
        ls_sub = [Subject.PHYSICS, 
                  Subject.CHEMISTRY, 
                  Subject.MATH]
        dic_type = {}
        base1 = {
            "Question": "",
            "Option 1": "",
            "Option 2": "",
            "Option 3": "",
            "Option 4": "",
            "Answer": None
        }
        base2 = {
            "Question": "",
            "Answer": None
        }
        base3 = {
            "Question": "",
            "Option 1": "",
            "Option 2": "",
            "Option 3": "",
            "Option 4": "",
            "Answer": []
        }
        if self.scq != 0:
            dic_type[QuestionType.SCQ] = [self.scq, base1]
        if self.mcq != 0:
            dic_type[QuestionType.MCQ] = [self.mcq, base3]
        if main_paragraph >= 1:
            dic_type[QuestionType.PARAGRAPH1] = [sub_paragraph, base1]
        if main_paragraph >= 2:
            dic_type[QuestionType.PARAGRAPH2] = [sub_paragraph, base1]
        if main_paragraph >= 3:
            dic_type[QuestionType.PARAGRAPH3] = [sub_paragraph, base1]
        if self.singledigit != 0:
            dic_type[QuestionType.DIGIT] = [self.singledigit, base2]
        if self.integer != 0:
            dic_type[QuestionType.INTEGER] = [self.integer, base2]
        if self.matching != 0:
            dic_type[QuestionType.MATCHING] = [self.matching, base1]
        for i in ls_sub:
            for j in dic_type:
                dic = {}
                for k in range(dic_type[j][0]):
                    dic[k+1] = dic_type[j][1]
                if j.startswith("Para"):
                    dic["main_question"] = ""
                Questions.objects.create(Test=self, Subject=i, Number=dic_type[j][0], Type=j, Questions=dic)
    def __str__(self):
        return self.Name

class Questions(models.Model):

    Test = models.ForeignKey(Test, on_delete=models.CASCADE, editable=False)
    Subject = models.CharField(
        max_length=11,
        choices=Subject.choices,
        editable=False
    )
    Number = models.IntegerField(verbose_name="Number of Questions")
    Positive = models.IntegerField(default=4, verbose_name="Marks", help_text="Marks for Correct Answer")
    Negative = models.IntegerField(default=0, verbose_name="Negative Marks", help_text="Marks for Wrong Answer")

    Type = models.CharField(
        max_length=12,
        choices=QuestionType.choices
    )
    
    Questions = models.JSONField(default=dict)
    def __str__(self):
        return f"{self.Test.Name} - {self.Subject} - {self.Type}({self.Number})"

    def test_name(self):
        return f"{self.Test.Name}"

class CurrentTest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    Test = models.ForeignKey(Test, on_delete=models.CASCADE, editable=False)
    test_started = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    Current = models.JSONField(default=dict)
    Answer_type = models.JSONField(default=dict, help_text="U = Unseen(Grey), S = Seen but not answered(Red), A = Answered(Green), M = Marked for Review(Purple), AM = Answered but Marked for Review(Purple with green)")
    Time_taken = models.JSONField(default=dict)
    Answer = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username} - {self.Test.Name}"

class UserAnswers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    class Subject(models.TextChoices):
        MATH = 'Mathematics', 'Mathematics'
        PHYSICS = 'Physics', 'Physics'
        CHEMISTRY = 'Chemistry', 'Chemistry'

    Test = models.ForeignKey(Test, on_delete=models.CASCADE, editable=False)
    Subject = models.CharField(
        max_length=11,
        choices=Subject.choices,
        editable=False
    )
    Attempt = models.IntegerField(default=1, verbose_name="Attempt Count")

    Answers = models.JSONField(default=dict)

    def get_test_name(self):
        try:
            test = Test.objects.get(TestId=self.test_id)
            return test.Name
        except Test.DoesNotExist:
            return "Unknown Test"
    def __str__(self):
        return f"{self.user.username} - {self.get_test_name()}"

class Results(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    Test = models.ForeignKey(Test, on_delete=models.CASCADE, editable=False)
    Marks = models.JSONField(default=dict)
    TotalMarks = models.JSONField(default=dict, editable=False)
    Timer = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username} - {self.Test.Name}"