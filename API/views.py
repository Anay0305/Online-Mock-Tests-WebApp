from django.shortcuts import render,HttpResponse,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from .models import Attempt, Test, CurrentTest, Subject, QuestionType, Questions, Section
from datetime import timedelta
import json

def formattime(time: int):
    ls = ""
    if time//60 != 0:
        if time//60 == 1:
            ls+="1 hr "
        else:
            ls+=f"{time//60} hrs "
    if time%60 != 0:
        if time%60 == 1:
            ls+="1 min "
        else:
            ls+=f"{time%60} mins "
    return ls.strip()

@login_required
@csrf_exempt
def check_attempt(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get('username')
            test_id = data.get('test_id')

            if not username or not test_id:
                return JsonResponse({"error": "Missing username or test_id"}, status=400)

            try:
                attempt = Attempt.objects.get(username=username)
            except Attempt.DoesNotExist:
                return JsonResponse({"check": False})

            if test_id in attempt.data:
                if attempt.data[test_id] == 0:
                    return JsonResponse({"check": False})
                return JsonResponse({"check": True, "count": attempt.data[test_id]})
            else:
                return JsonResponse({"check": False})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)

@csrf_exempt
def get_tests_data(request):
    x = Test.objects.all()
    dic = {}
    for i in x:
        dic[i.TestId] = {
            "name": i.Name,
            "time": formattime(int(i.Time))
        }
    return JsonResponse(dic)

@csrf_exempt
@login_required(login_url='login')
def StartTest(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('testid')

        if testid is not None:
            test = Test.objects.get(TestId=testid)
            if test.scq != 0:
                first = "SCQ"
            elif test.mcq != 0:
                first = "MCQ"
            elif test.paragraph != "0":
                first = "PARAGRAPH I"
            elif test.integer != 0:
                first = "INTEGER"
            elif test.singledigit != 0:
                first = "DIGIT"
            elif test.matching != 0:
                first = "MATCHING"
            types = test.get_question_types()
            current = {"P": {first: "1"}}
            time_taken = {
                "P": {},
                "C": {},
                "M": {}
                }
            for i in ["P", "C", "M"]:
                for j in types:
                    for k in range(types[j]):
                        if j in time_taken[i]:
                            time_taken[i][j][k+1] = 0
                        else:
                            time_taken[i][j] = {k+1: 0}
            answer_type = {
                "P": {},
                "C": {},
                "M": {}
                }
            for i in ["P", "C", "M"]:
                for j in types:
                    for k in range(types[j]):
                        if j in answer_type[i]:
                            answer_type[i][j][k+1] = "U"
                        else:
                            answer_type[i][j] = {k+1: "U"}
            def get_type(q_type):
                if q_type == "INTEGER" or q_type == "DIGIT":
                    return None
                else:
                    return []
            answers = {
                "P": {},
                "C": {},
                "M": {}
                }
            for i in ["P", "C", "M"]:
                for j in types:
                    for k in range(types[j]):
                        if j in answers[i]:
                            answers[i][j][k+1] = get_type(j)
                        else:
                            answers[i][j] = {k+1: get_type(j)}
            user_test_status, created = CurrentTest.objects.get_or_create(user=request.user, Test=test, Current=current, Time_taken=time_taken, Answer_type=answer_type, Answer=answers)
            user_test_status.test_started = True
            user_test_status.save()

            return JsonResponse({"status": "Test started"})
        return JsonResponse({"error": "Test ID is missing"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_time_left(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        if user_test is not None:
            end_time = user_test.created_at + timedelta(minutes=test.Time)
            time_left = end_time.timestamp() - timezone.now().timestamp()
            return JsonResponse({"time_left": round(time_left)})
        else:
            return JsonResponse({"error": "No Test Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def update_question_time(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        add_time = data.get('add_time')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        if user_test is not None:
            question_time = user_test.Time_taken
            for i in user_test.Current:
                for j in user_test.Current[i]:
                    k = user_test.Current[i][j]
                    question_time[i][j][str(k)] = question_time[i][j][str(k)] + add_time
            user_test.Time_taken = question_time
            user_test.save()
            return JsonResponse({"check": "True", "time": question_time[i][j][str(k)]})
        else:
            return JsonResponse({"error": "No Test Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_question_types(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        return JsonResponse(test.get_question_types())

@csrf_exempt
@login_required(login_url='login')
def get_current_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        if user_test is not None:
            return JsonResponse(user_test.Current)
        else:
            return JsonResponse({"error": "No Test Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def update_current_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        sub = data.get('subject')
        typee = data.get('type')
        number = data.get('number')
        if isinstance(number, int):
            number = f"{number}"
        test = Test.objects.get(TestId=testid)
        if number == "last":
            x = {
                "P": Subject.PHYSICS, "C": Subject.CHEMISTRY, "M": Subject.MATH
            }
            xx = {
                "SCQ": QuestionType.SCQ,
                "MCQ": QuestionType.MCQ,
                "INTEGER": QuestionType.INTEGER,
                "PARAGRAPH I": QuestionType.PARAGRAPH1,
                "PARAGRAPH II": QuestionType.PARAGRAPH2,
                "PARAGRAPH III": QuestionType.PARAGRAPH3,
                "MATCHING": QuestionType.MATCHING,
                "DIGIT": QuestionType.DIGIT
            }
            question_db = Questions.objects.get(Test=test, Subject=x[sub], Type=xx[typee])
            number = f"{question_db.Number}"
        new_current = {sub: {typee: number}}
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        if user_test is not None:
            user_test.Current = new_current
            user_test.save()
            return JsonResponse({"new_current": new_current})
        else:
            return JsonResponse({"error": "No Test Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_last_number(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        x = {
            "P": Subject.PHYSICS, "C": Subject.CHEMISTRY, "M": Subject.MATH
        }
        xx = {
            "SCQ": QuestionType.SCQ,
            "MCQ": QuestionType.MCQ,
            "INTEGER": QuestionType.INTEGER,
            "PARAGRAPH I": QuestionType.PARAGRAPH1,
            "PARAGRAPH II": QuestionType.PARAGRAPH2,
            "PARAGRAPH III": QuestionType.PARAGRAPH3,
            "MATCHING": QuestionType.MATCHING,
            "DIGIT": QuestionType.DIGIT
        }
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        for i in current:
            for j in current[i]:
                sub = x[i]
                typee = xx[j]
        question_db = Questions.objects.get(Test=test, Subject=sub, Type=typee)
        number = question_db.Number
        return JsonResponse({"number": number})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_type_data(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        x = {
            "P": Subject.PHYSICS, "C": Subject.CHEMISTRY, "M": Subject.MATH
        }
        xx = {
            "SCQ": QuestionType.SCQ,
            "MCQ": QuestionType.MCQ,
            "INTEGER": QuestionType.INTEGER,
            "PARAGRAPH I": QuestionType.PARAGRAPH1,
            "PARAGRAPH II": QuestionType.PARAGRAPH2,
            "PARAGRAPH III": QuestionType.PARAGRAPH3,
            "MATCHING": QuestionType.MATCHING,
            "DIGIT": QuestionType.DIGIT
        }
        for i in current:
            for j in current[i]:
                sub = x[i]
                typee = xx[j]
                t = j
        question_db = Questions.objects.get(Test=test, Subject=sub, Type=typee)
        section_db = Section.objects.get(Test=test, Type=typee)
        check = False
        if "main_message" in question_db.Questions:
            dic = {
                'main_question': question_db.Questions['main_message']
            }
            del dic["main_question"]
        else:
            dic = {}
        for i in question_db.Questions:
            if str(type(question_db.Questions[i]['Answer'])) == "list":
                check = True
        if question_db is not None:
            if t == "SCQ" or t == "MATCHING" or (t.startswith("PARA") and not check):
                message = f"This section contains <strong>{question_db.Number} {'Questions' if question_db.Number > 1 else 'Question'}.</strong> Each question has 4 options for correct answer. Multiple-Choice Questions (MCQs) <strong>Only one option is correct.</strong> For each question, marks will be awarded as follows:"
            if t == "MCQ" or check == True:
                message = f"This section contains <strong>{question_db.Number} {'Questions' if question_db.Number > 1 else 'Question'}.</strong> Each question has 4 options for correct answer. Multiple-Choice Questions (MCQs) <strong>One or more option is correct.</strong> For each question, marks will be awarded as follows:"
            if t == "INTEGER":
                message = f"This section contains <strong>{question_db.Number} {'Questions' if question_db.Number > 1 else 'Question'}.</strong><br>The answer to each question is a <strong>Numerical Value.</strong> For each question, marks will be awarded as follows:"
            if t == "DIGIT":
                message = f"This section contains <strong>{question_db.Number} {'Questions' if question_db.Number > 1 else 'Question'}.</strong><br>The answer to each question is a <strong>Single Digit Non negative Integer Value.</strong> For each question, marks will be awarded as follows:"
            message += f"<br><em>Full Marks</em>          :   +{section_db.Positive} If correct answer is selected."
            message += f"<br><em>Zero Marks</em>          :   0 If none of the option is selected."
            message += f"<br><em>Negative Marks</em>          :   {'-' if section_db.Negative != 0 else''}{section_db.Negative} If wrong answer is selected."
            dic["message"] = message
            return JsonResponse(dic)
        else:
            return JsonResponse({"error": "No Question db Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        x = {
            "P": Subject.PHYSICS, "C": Subject.CHEMISTRY, "M": Subject.MATH
        }
        xx = {
            "SCQ": QuestionType.SCQ,
            "MCQ": QuestionType.MCQ,
            "INTEGER": QuestionType.INTEGER,
            "PARAGRAPH I": QuestionType.PARAGRAPH1,
            "PARAGRAPH II": QuestionType.PARAGRAPH2,
            "PARAGRAPH III": QuestionType.PARAGRAPH3,
            "MATCHING": QuestionType.MATCHING,
            "DIGIT": QuestionType.DIGIT
        }
        for i in current:
            for j in current[i]:
                sub = x[i]
                typee = xx[j]
                number = current[i][j]
        question_db = Questions.objects.get(Test=test, Subject=sub, Type=typee)
        if question_db is not None:
            question_db.Questions[f"{number}"]["number"] = number
            return JsonResponse(question_db.Questions[f"{number}"])
        else:
            return JsonResponse({"error": "No Question db Found"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
@login_required(login_url='login')
def get_answer_type(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        for i in current:
            for j in current[i]:
                sub = i
                typee = j
        return JsonResponse(user_test.Answer_type[sub][typee])
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def get_answer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        for i in current:
            for j in current[i]:
                sub = i
                typee = j
                number = current[i][j]
        return JsonResponse({"answer": user_test.Answer[sub][typee][number]})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def update_answer_type(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        typee = data.get('type')
        print(typee)
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        for i in current:
            for j in current[i]:
                sub = i
                q_typee = j
                number = current[i][j]
        user_test.Answer_type[sub][q_typee][number] = typee
        user_test.save()
        return JsonResponse({"check": True})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required(login_url='login')
def update_answer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        testid = data.get('test_id')
        answer = data.get('answer')
        test = Test.objects.get(TestId=testid)
        user_test = CurrentTest.objects.get(user=request.user, Test=test)
        current = user_test.Current
        for i in current:
            for j in current[i]:
                sub = i
                typee = j
                number = current[i][j]
        user_test.Answer[sub][typee][number] = answer
        user_test.save()
        return JsonResponse({"check": True})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required
def submit_test(request):
    pass