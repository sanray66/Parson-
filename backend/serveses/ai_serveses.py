import os
import httpx
from schemas.user_messages import UserMessageCreate
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_INSTRUCTION = (
    "Ты — острый, бескомпромиссный психолог-профайлер. "
    "Ты видишь людей насквозь — не только то, что они говорят, "
    "но и то, что скрывают между строк."
)

QUESTION_MAP = {
    "question_1": "Кто ты?",
    "question_2": "Чем ты по-настоящему гордишься?",
    "question_3": "Что тебя может вывести из себя за секунду?",
    "question_4": "На что тебе никогда не жалко денег и времени?",
    "question_5": "В чем ты лучше большинства окружающих?",
    "question_6": "Опиши свой идеальный выходной",
    "question_7": "Какую главную ошибку в жизни ты бы не стал исправлять?",
    "question_8": "Что для тебя справедливость?",
    "question_9": "Кем бы ты стал, если бы пришлось начать жизнь с чистого листа в другой стране?",
    "question_10": "Зачем ты здесь?",
}


def prompt_for_ai(user_messages_in: UserMessageCreate) -> str:
    user_story = ""
    for key, value in QUESTION_MAP.items():
        answer_text = getattr(user_messages_in.answers, key)
        user_story += f"Вопрос: {value} - Ответ: {answer_text}"

    full_prompt = (
        "Ты — острый, бескомпромиссный психолог-профайлер. "
        "Ты видишь людей насквозь — не только то, что они говорят, но и то, что скрывают между строк.\n\n"
        
        "Перед тобой — ответы человека на 10 вопросов. Твоя задача:\n"
        "1. Вскрыть его настоящую личность — не ту, которую он хочет показать, а ту, которая проявляется в деталях\n"
        "2. Назвать его главную движущую силу и его главный внутренний конфликт\n"
        "3. Сказать ему то, что он, возможно, сам о себе не осознаёт\n\n"
        
        f"Ответы человека:\n{user_story}\n\n"
        
        "Напиши эссе-портрет по структуре:\n\n"
        "## Кто ты на самом деле\n"
        "Честная, острая характеристика — без лести, но с уважением. "
        "Скажи то, что большинство людей боятся сказать в лицо.\n\n"
        
        "## Твоя суперсила\n"
        "Что в этом человеке по-настоящему сильное и редкое.\n\n"
        
        "## Твоя слепая зона\n"
        "Что он не видит в себе, но что очевидно из его ответов. "
        "Это должно немного удивить — но не обидеть.\n\n"
        
        "## Что тебя по-настоящему драйвит\n"
        "Настоящая мотивация — глубже, чем кажется на первый взгляд.\n\n"
        
        "## Послание\n"
        "2-3 предложения напрямую к человеку. На 'ты'. "
        "Что-то, что он захочет перечитать.\n\n"
        
        "Стиль: умный, прямой, местами provocative. Никакой воды и банальщины. "
        "Читатель должен почувствовать, что его поняли глубже, чем он ожидал."
    )
    return full_prompt


async def get_psychological_analysis(user_messages_in: UserMessageCreate) -> str:
    prompt = prompt_for_ai(user_messages_in)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}", 
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "PsychologyApp",             
            },
            json={
                "model": "nvidia/nemotron-3-super-120b-a12b:free", 
                "messages": [
                    {"role": "system", "content": SYSTEM_INSTRUCTION},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 1.1,
            },
            timeout=60.0,
        )

    if response.status_code != 200:
        print(f"Error: {response.status_code}, {response.text}")
        return "Ошибка нейронки. Проверь логи."

    data = response.json()
    return data["choices"][0]["message"]["content"]


