.class public final La15;
.super Lom6;
.source "r8-map-id-e0518cc6312f1953c5164e252674cfa64754ff40b09b1c315a60eb336e5a265a"


# static fields
.field private static final zzb:La15;


# instance fields
.field private zzd:I

.field private zze:I


# direct methods
.method static constructor <clinit>()V
    .locals 2

    .line 1
    new-instance v0, La15;

    .line 2
    .line 3
    invoke-direct {v0}, Lom6;-><init>()V

    .line 4
    .line 5
    .line 6
    sput-object v0, La15;->zzb:La15;

    .line 7
    .line 8
    const-class v1, La15;

    .line 9
    .line 10
    invoke-static {v1, v0}, Lom6;->k(Ljava/lang/Class;Lom6;)V

    .line 11
    .line 12
    .line 13
    return-void
.end method


# virtual methods
.method public final f(I)Ljava/lang/Object;
    .locals 2

    .line 1
    add-int/lit8 p1, p1, -0x1

    .line 2
    .line 3
    if-eqz p1, :cond_4

    .line 4
    .line 5
    const/4 p0, 0x2

    .line 6
    if-eq p1, p0, :cond_3

    .line 7
    .line 8
    const/4 p0, 0x3

    .line 9
    if-eq p1, p0, :cond_2

    .line 10
    .line 11
    const/4 p0, 0x4

    .line 12
    if-eq p1, p0, :cond_1

    .line 13
    .line 14
    const/4 p0, 0x5

    .line 15
    if-ne p1, p0, :cond_0

    .line 16
    .line 17
    sget-object p0, La15;->zzb:La15;

    .line 18
    .line 19
    return-object p0

    .line 20
    :cond_0
    const/4 p0, 0x0

    .line 21
    throw p0

    .line 22
    :cond_1
    new-instance p0, Lmk4;

    .line 23
    .line 24
    sget-object p1, La15;->zzb:La15;

    .line 25
    .line 26
    invoke-direct {p0, p1}, Ljm6;-><init>(Lom6;)V

    .line 27
    .line 28
    .line 29
    return-object p0

    .line 30
    :cond_2
    new-instance p0, La15;

    .line 31
    .line 32
    invoke-direct {p0}, Lom6;-><init>()V

    .line 33
    .line 34
    .line 35
    return-object p0

    .line 36
    :cond_3
    const-string p0, "zze"

    .line 37
    .line 38
    sget-object p1, Lo64;->W:Lo64;

    .line 39
    .line 40
    const-string v0, "zzd"

    .line 41
    .line 42
    filled-new-array {v0, p0, p1}, [Ljava/lang/Object;

    .line 43
    .line 44
    .line 45
    move-result-object p0

    .line 46
    sget-object p1, La15;->zzb:La15;

    .line 47
    .line 48
    new-instance v0, Lfp6;

    .line 49
    .line 50
    const-string v1, "\u0004\u0001\u0000\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0001\u180c\u0000"

    .line 51
    .line 52
    invoke-direct {v0, p1, v1, p0}, Lfp6;-><init>(Ldk6;Ljava/lang/String;[Ljava/lang/Object;)V

    .line 53
    .line 54
    .line 55
    return-object v0

    .line 56
    :cond_4
    const/4 p0, 0x1

    .line 57
    invoke-static {p0}, Ljava/lang/Byte;->valueOf(B)Ljava/lang/Byte;

    .line 58
    .line 59
    .line 60
    move-result-object p0

    .line 61
    return-object p0
.end method
