export class TimeUtil {
  static readonly CHANGE_DAY_HOURS = 20; // UTC: 20:00, KST: NEXT DAY 05:00
  static readonly SECOND = 1000;
  static readonly MINUTE = 60 * TimeUtil.SECOND;
  static readonly HOUR = 60 * TimeUtil.MINUTE;
  static readonly DAY = 24 * TimeUtil.HOUR;

  /**
   * 시스템 현재 시간
   */
  static now(): Date {
    return new Date();
  }

  /**
   * 월 차감
   */
  static subMonth(date: Date, subMonth: number): Date {
    const temp = new Date(date);
    temp.setMonth(date.getMonth() - subMonth);

    return temp;
  }

  /**
   * 일 추가
   */
  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * TimeUtil.DAY);
  }

  /**
   * 일 차감
   */
  static subDays(date: Date, days: number): Date {
    return new Date(date.getTime() - days * TimeUtil.DAY);
  }

  /**
   * 시 추가
   */
  static addHours(date: Date, addHours: number): Date {
    return new Date(date.getTime() + addHours * TimeUtil.HOUR);
  }

  /**
   * 시 차감
   */
  static subHours(date: Date, subHours: number): Date {
    return new Date(date.getTime() - subHours * TimeUtil.HOUR);
  }

  /**
   * 분 추가
   */
  static addMinutes(date: Date, addMinutes: number): Date {
    return new Date(date.getTime() + addMinutes * TimeUtil.MINUTE);
  }

  /**
   * 분 차감
   */
  static subMinutes(date: Date, subMinutes: number): Date {
    return new Date(date.getTime() - subMinutes * TimeUtil.MINUTE);
  }

  /**
   * 초 추가
   */
  static addSeconds(date: Date, addSeconds: number): Date {
    return new Date(date.getTime() + addSeconds * TimeUtil.SECOND);
  }

  /**
   * 초 차감
   */
  static subSeconds(date: Date, subSeconds: number): Date {
    return new Date(date.getTime() - subSeconds * TimeUtil.SECOND);
  }

  /**
   * Date 간 시 차이
   */
  static diffHours(date1: Date, date2: Date): number {
    const diffHours =
      Math.abs(date1.getTime() - date2.getTime()) / TimeUtil.HOUR;

    return Math.floor(diffHours);
  }

  /**
   * Date 간 분 차이
   */
  static diffMinutes(date1: Date, date2: Date): number {
    const diffMinute =
      Math.abs(date1.getTime() - date2.getTime()) / TimeUtil.MINUTE;

    return Math.floor(diffMinute);
  }

  /**
   * Date 간 초 차이
   */
  static diffSecond(date1: Date, date2: Date): number {
    const diffSecond =
      Math.abs(date1.getTime() - date2.getTime()) / TimeUtil.SECOND;

    return Math.floor(diffSecond);
  }

  /**
   * Date 간 일 차이
   */
  static diffDay(
    date1: Date,
    date2: Date,
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): number {
    if (0 === baseHour) {
      baseHour = 24;
    }
    let date1BaseDate = this.getBaseDate(date1, baseHour);
    let date2BaseDate = this.getBaseDate(date2, baseHour);

    if (date1BaseDate <= date1) {
      date1BaseDate = this.addDays(date1BaseDate, 1);
    }
    if (date2BaseDate <= date2) {
      date2BaseDate = this.addDays(date2BaseDate, 1);
    }

    return (
      Math.abs(date1BaseDate.getTime() - date2BaseDate.getTime()) / TimeUtil.DAY
    );
  }

  /**
   * 일 변경 확인
   */
  static isChangeDay(
    date: Date,
    now = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): boolean {
    if (0 === baseHour) {
      baseHour = 24;
    }

    const currentTimeStamp = now.getTime();
    const dateTimeStamp = date.getTime();

    const endBaseDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseHour,
      0,
      0,
    );
    let endBaseDateTimeStamp = endBaseDate.getTime();
    if (endBaseDateTimeStamp <= dateTimeStamp) {
      endBaseDateTimeStamp = this.addDays(endBaseDate, 1).getTime();
    }
    const startBaseDateTimeStamp = this.subDays(endBaseDate, 1).getTime();

    return !(
      startBaseDateTimeStamp <= currentTimeStamp &&
      currentTimeStamp < endBaseDateTimeStamp
    );
  }

  /**
   * 주 변경 확인
   */
  static isChangeWeek(
    date: Date,
    now = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): boolean {
    if (0 === baseHour) {
      baseHour = 24;
    }

    return (
      this.diffDay(date, now, baseHour) > 6 ||
      this.dayOfWeek(now) - this.dayOfWeek(date) < 0
    );
  }

  /**
   * 월 변경 확인
   */
  static isChangeMonth(
    date: Date,
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): boolean {
    if (0 === baseHour) {
      baseHour = 24;
    }
    const now = this.now();
    const nowBaseDate = this.getBaseDate(now, baseHour);
    const endBaseDate = this.getBaseDate(date, baseHour);
    let nowAddDay = 0;
    let endAddDay = 0;
    if (nowBaseDate <= now) {
      nowAddDay = 1;
    }
    if (endBaseDate <= date) {
      endAddDay = 1;
    }

    const nowDateMonth = this.addDays(now, nowAddDay).getMonth();
    const endDateMonth = this.addDays(date, endAddDay).getMonth();

    return nowDateMonth !== endDateMonth;
  }

  /**
   * 요일
   */
  static dayOfWeek(
    date = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): number {
    const dateTimeStamp = date.getTime();
    let dayOfWeek = date.getDay();
    const endBaseDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseHour,
      0,
      0,
    ).getTime();
    if (endBaseDate <= dateTimeStamp) {
      dayOfWeek += 1;
    }

    return dayOfWeek < 0 ? 6 : dayOfWeek;
  }

  static getBaseDate(date: Date, baseHour = TimeUtil.CHANGE_DAY_HOURS): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      baseHour,
      0,
      0,
    );
  }

  static getDayStartAt(
    date = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): Date {
    const startDay = new Date(date);

    if (date.getHours() < baseHour) {
      startDay.setDate(date.getDate() - 1);
    }
    startDay.setHours(baseHour, 0, 0, 0);

    return startDay;
  }

  static getDayEndAt(
    date = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): Date {
    const endDay = new Date(date);

    if (date.getHours() < baseHour) {
      endDay.setHours(baseHour, 0, 0, 0);
    } else {
      endDay.setDate(date.getDate() + 1);
      endDay.setHours(baseHour, 0, 0, 0);
    }

    return endDay;
  }

  static getDayStartAtAndEndAt(
    date = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): Date[] {
    let startDate = new Date(date);
    let endDate = new Date(date);

    if (date.getHours() < baseHour) {
      startDate = new Date(startDate.setHours(0, 0, 0));
      endDate = new Date(endDate.setHours(23, 59, 59));
    } else {
      startDate.setDate(date.getDate() + 1);
      endDate.setDate(date.getDate() + 1);
      startDate = new Date(startDate.setHours(0, 0, 0));
      endDate = new Date(endDate.setHours(23, 59, 59));
    }

    return [startDate, endDate];
  }

  static getWeeklyEndAt(
    date = this.now(),
    weekStartsOn = 0,
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): Date {
    const dayOfWeek = date.getDay();
    const daysToAdd = (7 + weekStartsOn - dayOfWeek) % 7;
    const endDate = this.getDayEndAt(date, baseHour);
    endDate.setDate(endDate.getDate() + daysToAdd);

    return endDate;
  }

  static getMonthlyEndAt(
    date = this.now(),
    baseHour = TimeUtil.CHANGE_DAY_HOURS,
  ): Date {
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    const lastDate = new Date(date.getFullYear(), date.getMonth(), lastDay);

    return this.getDayEndAt(lastDate, baseHour);
  }

  static getTodayDate(date = this.now()): number {
    return date >= this.getBaseDate(date)
      ? this.addDays(date, 1).getDate()
      : date.getDate();
  }
}
