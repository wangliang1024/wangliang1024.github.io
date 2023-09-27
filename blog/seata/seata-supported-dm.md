# Seata支持达梦数据库了

## 背景

随着信息技术的飞速发展和数字化转型的推进，国产化软件产品在中国市场日益受到关注和重视。在国家政策的支持下，国产化软件产品迎来了前所未有的发展机遇。

计算服务（云服务器）、数据库服务（关系型数据库、NoSQL数据库）、网络服务（负载均衡）、存储服务（对象存储、日志）、中间件（网关、MQ、链路跟踪）等等，都在飞速的发展着。

[达梦数据库](https://www.dameng.com/)，就是在这样的背景下，快速成长起来的关系型数据库。目前它已成为主流的国产化关系型数据库之一，也是国产化政策中指定可使用的关系型数据库之一。


## 达梦数据库的特点：

达梦数据库具有以下几个特点：

1. **通用性：**达梦数据库管理系统兼容多种硬件体系，可在多种操作系统上运行，包括X86、X64、SPARC、POWER等硬件体系和32位/64位版本操作系统。
2. **高性能：**达梦数据库采用了一些优化策略和技术，可以在处理大数据量和高并发的情况下保持较高的性能，支持列存储、数据压缩、物化视图等面向联机事务分析场景的优化选项，同时提供了表级行存储和列存储选项技术，在同一产品中提供对联机事务处理和联机分析处理业务场景的支持。
3. **高可用性：**达梦数据库可配置数据守护系统(主备)，实现自动快速故障恢复，具有强大的容灾处理能力。
4. **跨平台性：**达梦数据库支持跨平台，可以在多种操作系统上运行，包括Windows、Linux等。
5. **完整解决方案：**达梦数据库提供了一整套解决方案，包括数据库管理、数据开发、数据治理等，方便企业全面管理和利用数据。
6. **高安全性：**达梦数据库采用了多种安全措施，保障数据的安全性。


## Seata 1.8.0 支持达梦数据库了

> 首先，非常感谢 github ID 为 [iquanzhan](https://github.com/iquanzhan) 的工程师，为Seata支持达梦数据库做出的贡献。<br>
> 他提交的PR为 [#3762](https://github.com/seata/seata/pull/3672)，欢迎大家查阅，也可参与讨论。

从 `Seata 1.8.0` 开始，已支持达梦数据库了，其中，包括了seata客户端与seata服务端，欢迎大家使用。

...其他内容待补充。


### AT模式的SQL限制

Seata的`AT`模式，目前支持 `INSERT`、`UPDATE`、`DELETE` 三类 DML 语法的部分功能，这些类型都是已经经过Seata开源社区的验证。SQL 的支持范围还在不断扩大，建议在本文限制的范围内使用。如果您有意帮助社区支持更多类型的SQL，请提交PR申请。

使用限制：
- 不支持 SQL 嵌套
- 不支持多表复杂 SQL（自1.6.0版本，MySQL支持UPDATE JOIN语句，详情请看）
- 不支持存储过程、触发器
- 部分数据库不支持批量更新，在使用 MySQL、Mariadb、PostgreSQL9.6+作为数据库时支持批量，批量更新方式如下以 Java 为例
```java
    // use JdbcTemplate
    public void batchUpdate() {
        jdbcTemplate.batchUpdate(
            "update storage_tbl set count = count -1 where id = 1",
            "update storage_tbl set count = count -1 where id = 2"
        );
    }
    
    // use Statement
    public void batchUpdateTwo() {
        statement.addBatch("update storage_tbl set count = count -1 where id = 1");
        statement.addBatch("update storage_tbl set count = count -1 where id = 2");
        statement.executeBatch();
    }
```


## 遗留的问题

### 问题描述：
达梦的驱动程序 `com.dameng:DmJdbcDriver18:8.1.2.192` （目前公网仓库中的最新版本），
在碰到违反唯一约束异常的时候，并未抛出 `SQLIntegrityConstraintViolationException`，而是抛出了 `BatchUpdateException`。
目前该问题已反馈给达梦技术人员，还未得到回复。

该问题导致了Seata无法正常捕获到 `SQLIntegrityConstraintViolationException`，并作相应的处理，影响到的功能：
1. AT模式：
    1.1. 分布式锁功能：当某条数据已存在分布式锁时，另一个事务进来竞争同一条数据的锁时，会报错。
    1.2. 二阶段回滚：
2. TCC模式：防悬挂功能，当二阶段回滚时，


### 临时规避以上问题的方法：

1. 临时修改seata源码，找到所有存在 `SQLIntegrityConstraintViolationException` 的代码段，并做相应的处理：
   ```java
   if (e instanceof SQLException && e.getMessage() != null && e.getMessage().contains("唯一性约束")) {
       // 与捕获 SQLIntegrityConstraintViolationException 的处理逻辑相同
   }
   ```
2. 找达梦技术人员支持，如果他们内部已经解决过该BUG，问他们要最新的驱动包就行。


## Seata 1.8.0 Release Notes：

内容待补充