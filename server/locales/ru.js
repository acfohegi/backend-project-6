// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      edit: 'Изменить',
      delete: 'Удалить',
      createStatus: 'Создать статус',
      createTask: 'Создать задачу',
    },
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          error: 'Не удалось удалить статус',
          hasTasks: 'Со статусом связаны задачи',
          success: 'Статус успешно удалён',
        },
        edit: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалёна',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменёна',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          hasTasks: 'С пользователем связаны задачи',
          success: 'Пользователь успешно удалён',
        },
        edit: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Изменение статуса',
          submit: 'Изменить статус',
        },
        new: {
          title: 'Создание статуса',
          submit: 'Создать статус',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        statusId: 'Статус',
        executorId: 'Исполнитель',
        creatorId: 'Автор',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Изменение задачи',
          submit: 'Изменить задачу',
        },
        new: {
          title: 'Создание задачи',
          submit: 'Создать задачу',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        email: 'Email',
        password: 'Пароль',
        createdAt: 'Дата создания',
        actions: 'Действия',
        edit: {
          title: 'Редактирование пользователя',
        },
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
      },
      welcome: {
        index: {
          hello: 'Привет!',
          description: 'Описание',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
